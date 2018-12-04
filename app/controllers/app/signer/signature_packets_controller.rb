class App::Signer::SignaturePacketsController < App::ApplicationController

  def index
    check_read(:none)
    @deals = non_download_signature_packets.select{|signature_packet| signature_packet.sent_at.present?}.flatten.map(&:deal).uniq
  end

  def show
    check_read(:none)
    signature_packet
  end

  def sign_packet
    check_read(:none)
    @deal = signature_packet.deal
    if signature_packet.docusign_envelope_id.present?
      redirect_to(signature_packet_docusign_signatures_path(signature_packet, redirect: params[:redirect]))
    else
      redirect_to(signature_packet_manual_signatures_path(signature_packet, redirect: params[:redirect]))
    end
  end

  def deal_signature_packets
    check_read(:none)
    @signature_packets = non_download_signature_packets.where(deal_id: params[:deal_id]).where.not(sent_at: nil).order(:created_at)
    @deal              = @signature_packets.first&.deal
  end

  def manual_signatures
    check_read(:none)
    @needs_signature_packets_count = (current_user.incomplete_signature_packets_on_deal(signature_packet.deal.id) - [signature_packet]).length
    if signature_packet.completed_at
      render 'manual_packet_complete' and return
    elsif Delayed::Job.where("handler LIKE '%gid://doxly/SignaturePacket/#{signature_packet.id}%' AND queue = 'process_manual_signatures'").any? {|job| !job.failed_at.present?}
      render 'complete' and return
    end
    # implicit render 'manual signatures'
  end

  def docusign_signatures
    check_read(:none)
    envelope_id = signature_packet.docusign_envelope_id
    signer = current_user
    if envelope_id.blank?
      flash.now[:error] = 'Invalid Packet. Please check and try again.'
      render :edit and return
    else
      redirect_url = signature_packet_signed_packet_url(signature_packet)
      @url         = signature_packet.deal.owner_entity.esignature_provider.get_recipient_url(envelope_id, signer, redirect_url)
      signature_packet.signature_pages.update_all(signature_status: 'opened', signature_status_timestamp: Time.now.utc) unless signature_packet.all_signature_pages_completed?
    end
  end

  def signed_packet
    check_read(:none)
    # update the packet signature pages status
    signature_packet.update_signature_page_statuses!(params[:event])
    # breakout of DS and navigate back to Doxly
    path    = complete_signature_packets_path(deal_id: signature_packet.deal.id, signature_packet_id: signature_packet.id)
    utility = DocusignRest::Utility.new
    render :text => utility.breakout_path(path), content_type: 'text/html'
  end

  def view_completed_packet
    check_read(:none)
    docusign_envelope_id = signature_packet.docusign_envelope_id
    if signature_packet.signed_aws_file.nil? && docusign_envelope_id.blank?
      flash.now[:error] = 'Signed packet is being uploaded. Please check back in a few minutes.'
      render 'shared/blank' and return
    end
    if docusign_envelope_id
      redirect_url = signature_packet_view_completed_packet_done_url(signature_packet)
      @url         = signature_packet.deal.owner_entity.esignature_provider.get_recipient_url(docusign_envelope_id, current_user, redirect_url)
    else
      @url = ApplicationHelper.viewer_url(view_signature_packet_path(signature_packet))
    end
  end

  def view_completed_packet_done
    check_read(:none)
    path = deal_signature_packets_signature_packets_path(deal_id: signature_packet.deal.id)
    utility = DocusignRest::Utility.new
    render :text => utility.breakout_path(path), content_type: 'text/html'
  end

  def view
    check_read(:none)
    display_file(signature_packet.signed_file_path)
  end

  def download
    check_read(:none)
    packet_name = "signature_packet_for_#{ApplicationHelper.sanitize_filename(signature_packet.user.name.downcase)}#{signature_packet.file_type}"
    download_file(signature_packet.signed_file_path, :filename => packet_name)
  end

  def uploaded_manual_signatures
    check_read(:none)

    # find the current_directory
    upload_batch_path = signature_packet.upload_batch_path(params[:batch_id])
    # check to make sure we can find the directory
    unless Dir.exist?(upload_batch_path)
      flash.now[:error] = "Uploading failed. Please refresh the page and try again"
      render 'blank' and return
    end

    # set the upload attempted at.
    signature_packet.upload_attempted_at = Time.now.utc
    signature_packet.bypass_approval_validation = true
    signature_packet.save

    # get the deal
    @deal = signature_packet.deal

    # get all the filenames in the current batch
    all_filenames = Dir.entries(upload_batch_path).reject{|filename| filename == "." || filename == ".."}

    # iterate over all the filenames and start a manual signature job for each.
    all_filenames.each do |filename|
      file_path = "#{upload_batch_path}/#{filename}"
      file_extension = File.extname(filename)
      if SignaturePacket::ALLOWED_FILE_UPLOAD_TYPES.include?(file_extension.downcase)
        ProcessManualSignaturesJob.perform_later(@deal, signature_packet.sent_by_entity_user, file_path.to_s, Time.now.in_time_zone(request.cookies["timezone"]).to_s, signature_packet)
      end
    end

    redirect_to complete_signature_packets_path(deal_id: @deal.id, signature_packet_id: signature_packet.id)
  end

  def find_packet
    check_read(:none)
    @anchor = params[:anchor_id]
  end

  def upload_signature_pages
    check_read(:none)
    signature_packet
  end

  def complete
    check_read(:none)
    # gets the incomplete packets on the deal
    @needs_signature_packets_count = (current_user.incomplete_signature_packets_on_deal(params[:deal_id]) - [signature_packet]).length
  end

  def uploads_queue
    check_read(:none)

    if params[:file]
      upload_batch_path = signature_packet.upload_batch_path(params[:batch_id])
      FileUtils.mkdir_p(upload_batch_path) unless Dir.exist?(upload_batch_path)

      uploaded_file = params[:file]
      file_extension = File.extname(uploaded_file.original_filename)
      file_path = "#{upload_batch_path}/#{uploaded_file.original_filename}"
      if SignaturePacket::ALLOWED_FILE_UPLOAD_TYPES.include?(file_extension.downcase)
        File.open(file_path, 'wb') do |file|
          file.write(uploaded_file.read)
        end
      end
    end
    render json: {}, status: :ok
  end

  def delete_from_uploads_queue
    check_read(:none)
    file_path = "#{signature_packet.upload_batch_path(params[:batch_id])}/#{params[:filename]}"
    if File.exist?(file_path)
      File.delete(file_path)
    end
    @filename = params[:filename]
  end

  def download_unsigned_packet
    check_read(:none)
    packet_name = "manual_signature_packet_for_#{ApplicationHelper.sanitize_filename(signature_packet.user.name.downcase)}#{signature_packet.file_type}"
    send_data(File.open(signature_packet.unsigned_file_path, 'rb'){|f| f.read }, { disposition: 'attachment', filename: packet_name })
  end

  private

  def non_download_signature_packets
    current_user.signature_packets.without_download_type
  end

  def signature_packet
    @signature_packet ||= non_download_signature_packets.find(params[:id] || params[:signature_packet_id])
  end

  def tree_element
    @tree_element ||= TreeElement.find_by(id: params[:tree_element_id])
  end
end
