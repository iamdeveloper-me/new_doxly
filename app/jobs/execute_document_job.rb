class ExecuteDocumentJob < ApplicationJob
  queue_as :execute_document

  def perform(document_hash, executing_deal_entity_user)
    begin
      deal               = executing_deal_entity_user.deal
      signature_page_ids = document_hash[:pages].select{|page| page[:signature_page_id].present?}.map{|page| page[:signature_page_id]}

      single_pdf         = CombinePDF.new
      executable_version = deal.closing_category.all_versions.select{|version| version.id == document_hash[:version_id].to_i}.first
      tree_element       = deal.closing_category.descendants.find(document_hash[:document_id])
      attachment         = tree_element.attachment
      signature_pages    = tree_element.signature_pages

      version_pdf        = CombinePDF.load(executable_version.converted_path, allow_optional_content: true)
      # Check if the page is a version or signature page then grab it and put it into the pdf
      document_hash[:pages].each do |page|
        if page[:signature_page_id]
          file_path = get_modified_signature_page(signature_pages, page[:signature_page_id])
          single_pdf << CombinePDF.load(file_path, allow_optional_content: true) if file_path
        else
          single_pdf << version_pdf.pages[page[:original_position]-1]
        end
      end

      # save the executed version
      begin
        tempfile = Tempfile.new(["executed-#{document_hash[:version_id]}-", ".pdf"], ApplicationHelper.temp_dir_root)
        single_pdf.save tempfile.path

        # save to AWS and upload
        Attachment.transaction do
          attachment.upload!(tempfile, executing_deal_entity_user.entity_user, { upload_method: "upload", filename: "executed-#{ApplicationHelper.sanitize_filename(tree_element.name.downcase)}.pdf", status: "executed" })
          if attachment.errors.empty?
            executed_version = attachment.reload.latest_version
            set_executed_against_version!(executed_version, executable_version)
            create_signature_page_executions!(executed_version.id, signature_pages, signature_page_ids)
          else
            deal.create_critical_error(:execute_signatures_error, { user_message: "Unable to upload the executed version back to the document '#{tree_element.name}'", exception: attachment.errors.full_messages })
            raise "#{attachment.errors.full_messages}"
          end
        end
      ensure
        # delete or close & unlink?
        File.delete(tempfile) if File.exist?(tempfile)
      end
    rescue StandardError => e
      deal.create_critical_error(:execute_signatures_error, { user_message: "Unable to process the executed version for the document '#{tree_element.name}'", exception: e })
    ensure
      remove_executing_state!(signature_pages, signature_page_ids)
    end
  end


  def remove_executing_state!(signature_pages, signature_page_ids)
    signature_pages = signature_pages.includes(tree_element_signature_group: :signature_pages).where(:id => signature_page_ids)
    signature_pages.each do |signature_page|
      signature_page.update!(is_executing: false)
      (signature_page.tree_element_signature_group.signature_pages.select{|page| page.signing_capacity_id == signature_page.signing_capacity_id} - [signature_page]).each do |page|
        page.update!(is_executing: false)
      end
    end
  end

  def create_signature_page_executions!(version_id, signature_pages, signature_page_ids)
    signature_pages = signature_pages.includes(tree_element_signature_group: :signature_pages).where(:id => signature_page_ids)
    signature_pages.each do |signature_page|
      signature_page.signature_page_executions.create!(version_id: version_id)
      (signature_page.tree_element_signature_group.signature_pages.select{|page| page.signing_capacity_id == signature_page.signing_capacity_id} - [signature_page]).each do |page|
        page.signature_page_executions.create!(version_id: version_id)
      end
    end
  end

  def set_executed_against_version!(executed_version, executable_version)
    executed_version.update(executed_against_version_id: executable_version.id )
  end

  def get_modified_signature_page(signature_pages, signature_page_id)
    page_file_path = signature_pages.find(signature_page_id)&.signed_file_path
    if page_file_path
      # silently process
      begin
        page_file = ApplicationHelper.im_image_from_path(page_file_path, { do_cleanup: false })
      rescue
      end

      if page_file
        # detect the background color of the image to determine the fill of overlay -- not perfect but good enough.
        pixel_color_conversion_const = 257 # the color values are stored in 16bit quantum-depth. Divide by 257 to scale it up to [0..255]
        page_file_background_red     = page_file.pixel_color(10, 10).red/pixel_color_conversion_const || 255
        page_file_background_green   = page_file.pixel_color(10, 10).green/pixel_color_conversion_const || 255
        page_file_background_blue    = page_file.pixel_color(10, 10).blue/pixel_color_conversion_const || 255

        blank_overlay_image = Magick::Image.new(350, 350) do
          self.background_color = "rgb(#{page_file_background_red},#{page_file_background_green},#{page_file_background_blue})"
          self.quality          = 80
          self.density          = '300'
        end

        # cover the QR code with a "background matching" blank image
        modified_page_file = page_file.composite(blank_overlay_image, Magick::SouthEastGravity, 100, 100, Magick::OverCompositeOp)
        modified_page_file.write(page_file_path)

        # clean up
        page_file.destroy!
        blank_overlay_image.destroy!
        modified_page_file.destroy!
      end
      page_file_path
    end
  end
end
