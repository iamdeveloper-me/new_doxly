require 'zxing'

class ProcessManualSignaturesJob < ApplicationJob
  queue_as :process_manual_signatures

  def perform(deal, entity_user, file_path, upload_time_string=Time.now.to_s, signature_packet=nil)
    @batch_id = SecureRandom.uuid
    @deal = deal
    @entity_user = entity_user
    @file_path = file_path
    @upload_time_string = upload_time_string # time objects can't be passed into delayed jobs
    @signature_packet = signature_packet
    @unreadable_pages = []
    @wrong_packet_pages = []
    @already_signed_pages = []
    errors = []
    processed_signature_pages = []
    # grab the UUID from each page
    begin
      # reset all the existing errors
      @deal.manual_signature_errors.update_all(:is_read => true)

      # process each page
      file_list = split_packet
      file_list.each_with_index do |file, index|
        begin
          # get signature page
          signature_page_key, rotations = get_signature_page_key(file, index)
          next if signature_page_key.nil?

          signature_pages = get_signature_pages(signature_page_key, index)
          next if signature_pages.empty?

          # mark as signed
          mark_as_signed(signature_pages)
          mark_packets_as_complete(signature_pages)

          # upload
          upload_signed_pages(file, index, rotations, signature_pages)

          # push the page into the processed_signature_pages array
          processed_signature_pages += signature_pages

        rescue StandardError => e
          errors << { page: index+1, message: e.message }
        ensure
          file.destroy! if file && !(signature_page_key == SignaturePage::DUMMY_QR_CODE_VALUE)
        end
      end

      # recompile all of the packets to include the new pages.
      signature_packets_to_update = processed_signature_pages.map(&:signature_packet).uniq
      signature_packets_to_update.map {|signature_packet| UpdateSignaturePacket.perform_later(signature_packet)}

      # check for unreadable or wrong packet pages to create unmatched uploads
      @unmatched_pages = @unreadable_pages + @wrong_packet_pages
      if @unmatched_pages.any?
        @file_name = Pathname.new(@file_path)
        unmatched_upload = create_unmatched_signature_upload
        if unmatched_upload
          @unmatched_pages.sort.each do |page_number|
            unmatched_page = create_unmatched_signature_upload_pages(unmatched_upload, page_number)
            upload_unmatched_page(page_number-1, unmatched_page) if unmatched_page
          end
        end
      end

    rescue StandardError => e
      errors << { message: e.message }
    end

    # if the packet was uploaded by a client, check for sending the email if it's the last page of the file
    if @signature_packet.present?
      send_packet_completion_email
    end

    # check for errors
    if processed_signature_pages.empty?
      user_message = if @already_signed_pages.any?
        "The uploaded file has pages that have already been marked as signed on the tracker and those pages have not been processed. Please check and try again."
      else
        "Could not find any valid signature pages to process in the uploaded file. Please try to match the pages using the unmatched uploads button to the right or try uploading again."
      end
      deal.create_critical_error(:manual_signatures_error, { user_message: user_message, exception: errors })
    elsif errors.any?
      deal.create_critical_error(:manual_signatures_error, { user_message: "#{errors.size} of the signature pages uploaded by #{entity_user.user.name} could not be processed.", exception: errors })
    end

    # send the notification
    if (processed_signature_pages.empty? || errors.any?)
      SupportMailer.processing_manual_signatures_failed_email(deal, entity_user, file_path, {
        signature_packet: signature_packet, errors: errors, unreadable_pages: @unreadable_pages, wrong_packet_pages: @wrong_packet_pages, already_signed_pages: @already_signed_pages
      }).deliver_later
    end

    # clean up
    FileUtils.remove_dir("#{get_converted_pages_path}")
  end

  def split_packet
    Magick::ImageList.new(@file_path) do
      self.quality = 80
      self.density = '300'
    end.to_a
  end

  def get_signature_page_key(file, index)
    create_original_image(file, index) # convert to image
    signature_page_key, rotations = scan_uploaded_page(file, index) # scan QR code
    if !signature_page_key
      @unreadable_pages.push(index+1) # track page numbers
      return
    end
    return signature_page_key, rotations
  end

  def create_original_image(file, index)
    # save the original file to upload with the page
    file_name = Pathname.new(@file_path)
    original_image_file_path = "#{get_converted_pages_path}/original_#{index}_#{file_name.basename}".gsub(/ /, '_')
    file.alpha = Magick::BackgroundAlphaChannel
    file.write(original_image_file_path)
    return
  end

  def scan_uploaded_page(file, index)
    file_name = Pathname.new(@file_path)
    signature_page_key = nil
    rotations = -1
    while signature_page_key.blank? && rotations < 4
      # rotate the image
      rotations += 1
      rotated_file = file.rotate(90*rotations)

      # progressively zoom in until the qr code works
      corner_width = rotated_file.columns/4
      while signature_page_key.blank? && corner_width > rotated_file.columns/32 do
        # crop out everything but the qr code
        cropped_file = rotated_file.crop(Magick::SouthEastGravity, corner_width, corner_width, true)

        # convert into an image
        image_file_path = "#{get_converted_pages_path}/#{index}_#{file_name.basename}.jpg".gsub(/ /, '_')
        cropped_file.write(image_file_path)

        # Read the QR Code
        # Try ZXing first
        signature_page_key = begin
          ZXing.decode(image_file_path)
        rescue
        end
        if signature_page_key.blank?
          # Try with ZBar. ZBar has issues working with certain jpg images. The fix is to format to PGM first and then read.
          signature_page_key = begin
            image_file = ApplicationHelper.im_image_from_path(image_file_path, { set_resolution: false, set_background: false, do_cleanup: false }) do |image|
              image.format = 'PGM'
            end
            file_blob = image_file.to_blob
            image_file.destroy!
            ZBar::Image.from_pgm(file_blob).process&.first&.data
          rescue
          end
        end

        # clean up
        File.delete(image_file_path)

        # reduce size
        corner_width -= rotated_file.columns/32 # reducing by a 32nd guarantees it won't run more than 8 times
      end
    end
    return signature_page_key, rotations
  end

  def get_signature_pages(signature_page_key, index)
    return [] if signature_page_key == SignaturePage::DUMMY_QR_CODE_VALUE || signature_page_key == SignaturePage::DUMMY_CUSTOM_CODE_VALUE

    # find all the signature_pages that correspond with that key.
    # Also we have to check the old unique_key here because we changed the logic by which unique keys are generated. Can get rid of this in a few months.
    signature_pages = (@signature_packet || @deal).signature_pages.select{ |signature_page| signature_page.unique_key == signature_page_key || (signature_page.old_unique_key.present? && (signature_page.old_unique_key == signature_page_key)) }
    if signature_pages.empty? # page didn't match packet if uploaded by signer or page didn't match the deal if uploaded on signature grid page
      @wrong_packet_pages.push(index+1)
      return []
    end

    signature_pages_to_use = signature_pages.reject{ |signature_page| signature_page.complete? && signature_page.signed_aws_file.present? }
    if signature_pages_to_use.empty? # they are trying to re-upload pages that have already been marked as signed
      @already_signed_pages.push(index+1)
      return []
    end
    signature_pages_to_use
  end

  def mark_as_signed(signature_pages)
    signature_pages.map{ |signature_page| signature_page.update(signature_status: 'signed', signature_status_timestamp: Time.now.utc) }
  end

  def mark_packets_as_complete(signature_pages)
    signature_pages.each do |signature_page|
      packet = signature_page.signature_page_collection.signature_packet
      next if packet.completed_at
      if packet.signature_pages.reload.where.not(signature_status: 'signed').empty?
        packet.completed_at               = Time.now.utc
        packet.bypass_approval_validation = true
        packet.save
        # mark any notifications as complete (if a DS packet was uploaded as manual)
        packet.esignature_notifications.each(&:received!) if packet.esignature_notifications.any?
      end
    end
  end

  def upload_signed_pages(file, index, rotations, signature_pages)
    file_name = Pathname.new(@file_path)
    # rotate file
    rotated_original_image_file_path = "#{get_converted_pages_path}/rotated_original_#{index}_#{file_name.basename}".gsub(/ /, '_')
    rotated_file = file.rotate(rotations*90)
    rotated_file.write(rotated_original_image_file_path)

    extension = File.extname(rotated_original_image_file_path)
    # convert to pdf if not already
    if extension != '.pdf'
      converted_temp_file = Tempfile.new(['converted', '.pdf'], ApplicationHelper.temp_dir_root)
      FileConvert.process_file_conversion(rotated_original_image_file_path, converted_temp_file.path)
      rotated_original_image_file = converted_temp_file
    else
      rotated_original_image_file = File.open(rotated_original_image_file_path)
    end

    begin
      # upload to aws
      signature_pages.each do |signature_page|
        ApplicationHelper.retry_command do
          signature_page.upload!(rotated_original_image_file, 'signed')
        end
        unless signature_page.signed_aws_file.present?
          SupportMailer.processing_manual_signatures_failed_email(@deal, @entity_user, rotated_original_image_file.path, {
            errors: [{ message: "Could not upload the signed signature page with id #{signature_page.id} to aws" }]
          }).deliver_later
        end
      end
    ensure
      if rotated_original_image_file
        rotated_original_image_file.close
      end
    end
  end

  def send_packet_completion_email
    if @signature_packet.reload.completed_at
      DealMailer.received_signatures_email(@signature_packet).deliver_later
      DealMailer.received_signature_packet_email(@signature_packet).deliver_later
      DealMailer.received_signature_packet_email_copy(@signature_packet).deliver_later if @signature_packet.copy_to?
    end
  end

  def get_converted_pages_path
    @converted_pages_path ||= begin
      path = "#{ApplicationHelper.signature_management_root}/deal_#{@deal.id}/manual_signatures/converted_pages/#{@batch_id}"
      FileUtils.mkdir_p(path) unless Dir.exist?(path) # build directories if necessary
      path
    end
  end

  def create_unmatched_signature_upload
    @deal.unmatched_signature_uploads.create(file_name: @file_name.basename, uploader_id: @signature_packet ? @signature_packet.user_id : @entity_user.user.id, is_client_upload: @signature_packet.present?)
  end

  def create_unmatched_signature_upload_pages(unmatched_signature_upload, page_number)
    unmatched_signature_upload.unmatched_signature_upload_pages.create(page_number: page_number, status: 'unmatched')
  end

  def upload_unmatched_page(index, unmatched_signature_page)
    original_image_file_path = "#{get_converted_pages_path}/original_#{index}_#{@file_name.basename}".gsub(/ /, '_')
    extension = File.extname(original_image_file_path)

    # convert to pdf if not already
    if extension != '.pdf'
      converted_temp_file = Tempfile.new(['converted', '.pdf'], ApplicationHelper.temp_dir_root)
      FileConvert.process_file_conversion(original_image_file_path, converted_temp_file.path)
      original_image_file = converted_temp_file
    else
      original_image_file = File.open(original_image_file_path)
    end

    begin
      # upload to aws
      ApplicationHelper.retry_command do
        unmatched_signature_page.upload!(original_image_file)
      end
    ensure
      if original_image_file
        original_image_file.close
      end
    end
  end

end
