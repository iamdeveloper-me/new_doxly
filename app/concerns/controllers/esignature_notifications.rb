module Controllers::EsignatureNotifications

  private

  def retrieve_from_docusign(notification)
    # if this has already been received, nothing else to do
    return if notification.received? || notification.critical_errors.where(:error_type => 'receiving_signatures_error').size > EsignatureNotification::RETRIEVAL_ATTEMPTS
    # start processing
    notification.start_processing!
    # start the retrieval
    pages_updated           = true
    docusign_status_mapping = SignaturePacket::DOCUSIGN_STATUS_MAPPING
    signature_packet        = notification.signature_packet
    envelope_id             = notification.envelope_id
    begin
      api                     = signature_packet.deal.owner_entity.esignature_provider.api_client
      envelope_status         = get_envelope_status(api, envelope_id)
      status                  = (envelope_status["status"] || "").downcase
      if status == docusign_status_mapping[:completed]
        process_completed_envelope(api, signature_packet, envelope_id)
        pages_updated = signature_packet.signature_pages.reload.select{ |sp| sp.signed_aws_file.nil? }.empty?
        DealMailer.received_signatures_email(signature_packet).deliver_later
        DealMailer.received_signature_packet_email(signature_packet).deliver_later
        DealMailer.received_signature_packet_email_copy(signature_packet).deliver_later if signature_packet.copy_to?
      elsif status == docusign_status_mapping[:declined]
        update_packet_completion(signature_packet)
      end

      # mark notification as received only if this is a valid event and all the individual pages have been updated with the signed copies
      notification.received! if [docusign_status_mapping[:completed], docusign_status_mapping[:declined]].include?(status) && pages_updated
    rescue StandardError => e
      # log the error
      critical_errors = notification.critical_errors
      critical_error  = critical_errors.new
      critical_error.save_new!(:receiving_signatures_error, { exception: e })
      # if we have already tried the max attempts, the task is not going to try anymore. So, we
      # need to email support/engg
      SupportMailer.packet_retrieval_failed_email(notification) if critical_errors.reload.where(:error_type => 'receiving_signatures_error').size >= EsignatureNotification::RETRIEVAL_ATTEMPTS
    ensure
      # start processing
      notification.end_processing!
    end
  end

  def get_envelope_status(api, envelope_id)
    api.get_envelope_status(:envelope_id => envelope_id)
  end

  def process_completed_envelope(api, signature_packet, envelope_id)
    entity_user       = signature_packet.sent_by_entity_user
    files_base        = "#{ApplicationHelper.signature_management_root}/deal_#{signature_packet.deal.id}/signature_pages"
    packet_filename   = "signature_packet_#{signature_packet.user.id}_#{signature_packet.deal.id}_signed.pdf"
    local_file_path   = "#{files_base}/#{packet_filename}"

    FileUtils.mkdir_p(files_base) unless Dir.exist?(files_base)
    FileUtils.touch(local_file_path)

    api.get_combined_document_from_envelope(
      :envelope_id      => envelope_id,
      :local_save_path  => local_file_path
    )
    return unless File.exist? local_file_path
    signature_page_collections = signature_packet.signature_page_collections.order('id asc')

    combined_file = CombinePDF.load(local_file_path, allow_optional_content: true).pages

    # index to skip multiple copies
    signature_page_index = 0

    signature_page_collections.each do |signature_page_collection|
      signature_page_collection_file_page_count = signature_page_collection.signature_pages.where(is_custom: true).length
      signature_page_collection_file_page_count += SignaturePageSplitter.split_signature_page(signature_page_collection, files_base)&.count.to_i if signature_page_collection.signature_pages.where(is_custom: false).any?
      # iterate through the signature_pages using the file_page_to_sign to grab the correct file page
      signature_page_collection.signature_pages.each do |signature_page|

        single_file_path = "#{files_base}/signature_page_signed_#{signature_page.id}.pdf"
        single_file      = CombinePDF.new
        single_file << combined_file[signature_page_index + signature_page.file_page_to_sign - 1]
        single_file.save single_file_path
        single_file = File.open(single_file_path)
        begin
          if signature_page.upload!(single_file, 'signed')
            signature_page.update(signature_status: 'signed', signature_status_timestamp: Time.now.utc) if signature_page.signature_status != 'signed'
            File.delete(single_file_path) if File.exist?(single_file_path)
          else
            raise("Could not upload the signed signature page to page #{signature_page.id}")
          end
        ensure
          single_file.close if single_file
        end
        # jump forward skipping if there were multiple copies
      end
      signature_page_index += (signature_page_collection.tree_element.number_of_signature_page_copies * signature_page_collection_file_page_count)
    end

    # send to aws
    local_file = File.open(local_file_path)
    begin
      if signature_packet.upload!(local_file, 'signed')
        File.delete(local_file_path) if File.exist?(local_file_path)
      else
        raise("Could not upload the signed signature packet to packet #{signature_packet.id}")
      end
    ensure
      local_file.close if local_file
    end

    # everything was successful -- update the packet as complete
    update_packet_completion(signature_packet)
  end

  def update_packet_completion(signature_packet)
    signature_packet.completed_at               = Time.now.utc
    signature_packet.bypass_approval_validation = true
    signature_packet.save
  end

end
