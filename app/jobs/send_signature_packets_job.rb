class SendSignaturePacketsJob < ApplicationJob
  queue_as :send_signature_packets

  def perform(signature_packet, signature_page_collections, entity_user, options={})
    notifications_url                         = options.fetch(:notifications_url, nil)
    docusign                                  = options.fetch(:docusign, false)
    created_signature_packet_review_documents = options.fetch(:created_signature_packet_review_documents, [])
    # to hold the failed pages when adding to a pre-existing packet
    failed_page_collections = []
    # get the deal
    deal        = signature_packet.deal
    user        = signature_packet.user
    signer_name = signature_packet.signing_capacities.first.name

    # reset all the existing errors
    deal.send_packets_errors.update_all :is_read => true

    begin
      # Create a deal specific directory
      deal_signature_pages_base = "#{ApplicationHelper.signature_management_root}/deal_#{deal.id}/signature_pages"
      # Ensure the directory exists
      FileUtils.mkdir_p(deal_signature_pages_base) unless Dir.exist?(deal_signature_pages_base)
      # save generated PDFs locally to send to aws and docusign
      pdfs       = []
      token      = SecureRandom.hex(50)
      url        = "#{notifications_url}?token=#{token}" if docusign
      signature_page_collections_size = signature_page_collections.size

      signature_packet_file_path = "#{deal_signature_pages_base}/signature_packet_#{signature_packet.id}.pdf"
      # if signature_packet already exists, download from aws.
      if signature_packet.unsigned_aws_file.present?
        single_pdf = CombinePDF.load(signature_packet.unsigned_file_path, allow_optional_content: true)
      else
        single_pdf = CombinePDF.new
      end
      # if new packet, will be 1, otherwise will be the next page number for the pre-existing packet.
      current_packet_page_number = single_pdf.pages.length
      page_path_objects = []
      signature_page_collections.each do |signature_page_collection|
        signature_page_collection_path, number_of_pages_in_the_file = signature_page_collection.generate(deal_signature_pages_base)
        signature_page_collection.signature_pages.each do |signature_page|
          # this line will correctly break if signature_page.file_page_to_sign never gets set.
          # have to reload here because for some reason file_page_to_sign is sometimes not present.
          signature_page.packet_page_number = current_packet_page_number + signature_page.reload.file_page_to_sign
          signature_page.save
        end
        current_packet_page_number += (number_of_pages_in_the_file * signature_page_collection.tree_element.number_of_signature_page_copies)
        signature_page_collection_file = File.open(signature_page_collection_path)
        pdfs.push(signature_page_collection_file)

        current_pdf = pdfs.last
        # reopen for later use
        current_pdf.reopen(current_pdf.path, "r")
        signature_page_collection_file_to_add = CombinePDF.load(signature_page_collection_file.path, allow_optional_content: true)
        # single_pdf << signature_page_collection_file_to_add
        # add the page to the packet as many times as needed based on the number of copies.
        signature_page_collection.tree_element.number_of_signature_page_copies.times do |num|
          single_pdf << signature_page_collection_file_to_add # unless num == 0

          # collect the pages and their paths for sending to docusign later if necessary
          page_path_objects << {signature_page_collection: signature_page_collection, path: current_pdf.path, number_of_pages_in_the_file: number_of_pages_in_the_file}
        end
      end

      single_pdf.save signature_packet_file_path if signature_page_collections_size > 0
      # update the packet
      signature_packet.sent_at                      = Time.now.utc
      signature_packet.sent_by_user_id              = entity_user.id
      signature_packet.bypass_approval_validation   = true
    rescue StandardError => e
      # log and notify about the error
      deal.create_critical_error(:send_packets_error, { user_message: "Failed to send packet for #{signer_name}. Please try again.", exception: e })
      SupportMailer.sending_packet_failed_email(deal, entity_user, user.email, signer_name, e.message, docusign).deliver_later
      notify_sender_of_failed_packet(signature_packet, signature_page_collections, created_signature_packet_review_documents, entity_user, docusign, false, signer_name)

      if signature_packet.signature_pages.length == signature_page_collections.map(&:signature_pages).flatten.length
        signature_packet.destroy
      else
        # if the signature_packet is going to persist, destroy all the new signature_packet_review_documents
        created_signature_packet_review_documents.map{ |signature_packet_review_document| signature_packet_review_document.destroy }
      end
      signature_page_collections.each do |signature_page_collection|
        signature_page_collection.signature_pages.each do |page|
          page.signature_status = "not_sent"
          page.packet_page_number = nil
          page.file_page_to_sign = nil
          page.save
        end
      end
      return
    end

    # send to docusign
    if docusign
      if signature_packet.docusign_envelope_id.present?
        # add each page to the existing packet
        page_path_objects.each do |object|
          # TODO collect all the signature_page_collections into one document and send all at once to avoid issues with packet_page_objects to aligning right.
          response_hash = signature_packet.add_document_to_packet_on_docusign(object[:signature_page_collection], object[:number_of_pages_in_the_file], object[:path])

          unless response_hash[:success]
            failed_page_collections << object[:signature_page_collection]
            # if object doesn't work, set status back to "not_sent" and remove from signature_pages array so it's not sent to aws.
            object[:signature_page_collection].signature_pages.each do |signature_page|
              signature_page.signature_status = "not_sent"
              signature_page.packet_page_number = nil
              signature_page.file_page_to_sign  = nil
              signature_page.save
            end

            # remove from the signature_packet as well
            object[:signature_page_collection].signature_packet_signature_page_collection.destroy

            # remove the signature_packet_review_documents
            signature_packet_review_document_to_remove = created_signature_packet_review_documents.select{ |signature_packet_review_document| signature_packet_review_document.tree_element_id == object[:signature_page_collection].tree_element_signature_group.tree_element_id }.first
            signature_packet_review_document_to_remove&.destroy

            # add the error
            deal.create_critical_error(:send_packets_error, {
              user_message: "Failed to add one or more signature pages to an existing packet on Docusign for #{signer_name}. Please try again.",
              exception: response_hash[:response]
            })
          end
        end
        # destroy all review documents if no pages got added successfully
        if failed_page_collections.length == page_path_objects.length
          created_signature_packet_review_documents.map{ |created| created&.destroy }
        end
        if failed_page_collections.any?
          # notify the sender and support regarding the failed pages
          notify_sender_of_failed_packet(signature_packet, page_path_objects.map{|object| object[:signature_page_collection]}, created_signature_packet_review_documents, entity_user, docusign, true, signer_name)
          SupportMailer.sending_packet_failed_email(deal, entity_user, user.email, signer_name, "Failed to add signature pages to an existing packet on Docusign for #{signer_name} (SignaturePageCollection IDs: #{failed_page_collections.map(&:id).join(', ')})", docusign).deliver_later
        end
      else
        # try to send the new packet to docusign
        response_hash = signature_packet.send_to_docusign(signature_packet_file_path, page_path_objects, url)
        envelope_id   = response_hash[:envelope_id]
        if envelope_id.present?
          # update the packet
          signature_packet.docusign_envelope_id = envelope_id
          signature_packet.save!

          # create the notification
          notification             = signature_packet.esignature_notifications.new
          notification.envelope_id = envelope_id
          notification.token       = token
          notification.save!
        else
          # reset the pages
          signature_page_collections.map{|signature_page_collection| signature_page_collection.signature_pages }.flatten.each do |signature_page|
            signature_page.signature_status           = 'not_sent'
            signature_page.signature_status_timestamp = Time.now.utc
            signature_page.packet_page_number         = nil
            signature_page.file_page_to_sign          = nil

            signature_page.save!
          end

          signature_page_collections.map {|signature_page_collection| signature_page_collection.signature_packet_signature_page_collection.destroy }

          # clean up the created files
          pdfs.each do |pdf|
            File.delete(pdf) if File.exist?(pdf.path)
          end
          File.delete(signature_packet_file_path)

          # add and notify about the error
          deal.create_critical_error(:send_packets_error, {
            user_message: "Failed to send the signature packet for #{signer_name} to Docusign. Please make sure the integration credentials are valid and try again.",
            exception: response_hash[:response]
          })
          SupportMailer.sending_packet_failed_email(deal, entity_user, user.email, signer_name, "Failed to send a signature packet to docusign", docusign).deliver_later
          notify_sender_of_failed_packet(signature_packet, signature_page_collections, created_signature_packet_review_documents, entity_user, docusign, false, signer_name)
          # one more thing to do
          signature_packet.destroy!
          return
        end
      end

    end

    # save the packet
    signature_packet.save!

    # could do this without the index just using the copy_number to add... Maybe would be cleaner?
    signature_page_collections.sort_by{ |signature_page_collection| signature_page_collection.id }.each_with_index do |signature_page_collection, i|
      signature_page_collection.signature_pages.map do |signature_page|
        signature_page.ready!
      end
      signature_page_collection.upload!(pdfs[i])
    end

    # only send the email if the packet_type is "email"
    if signature_packet.packet_type == "email"
      # figure out which email to send
      user_deal_signature_packets = user.signature_packets.where("deal_id = #{deal.id} AND id != #{signature_packet.id}")
      # send the user the update email if there are already signature_packets sent on the deal and an email hasn't been sent recently. AND if all the pages to send didn't fail.
      if user_deal_signature_packets.where("created_at < ?", signature_packet.updated_at - 1.minute ).any? && user_deal_signature_packets.where(created_at: (signature_packet.updated_at - 1.minute)..signature_packet.updated_at).empty? && page_path_objects.length != failed_page_collections.length
        DealMailer.additional_signature_pages_email(signature_packet).deliver_later
        if signature_packet.copy_to?
          DealMailer.additional_signature_pages_email_copy(signature_packet).deliver_later
        end
        # if it's the first packet on the deal
      elsif user_deal_signature_packets.where("created_at < ?", signature_packet.created_at).empty?
        DealMailer.signature_packet_notification_email(signature_packet).deliver_later
        if signature_packet.copy_to?
          DealMailer.signature_packet_notification_email_copy(signature_packet).deliver_later
        end
      end
    end

    # save to aws
    signature_packet_file = File.open(signature_packet_file_path)
    begin
      signature_packet.upload!(signature_packet_file_path)
    ensure
      if signature_packet_file
        signature_packet_file.close
      end
    end
  end

  def notify_sender_of_failed_packet(signature_packet, signature_page_collections, created_signature_packet_review_documents, entity_user, docusign, additional_pages, signer_name)
    # have to get all the text/information for the email here because when job tries to deserialize objects, they'll all be deleted.
    signature_pages                                   = signature_page_collections.map{ |signature_page_collection| signature_page_collection.signature_pages }.flatten
    additional_pages                                  = additional_pages
    method_text                                       = docusign ? 'DocuSign' : 'Manual'
    copy_to                                           = signature_packet.copy_to
    sender                                            = sender
    message                                           = signature_packet.message
    signature_packet_review_document_tree_element_ids = created_signature_packet_review_documents.map(&:tree_element_id).compact
    document_objects                                  = signature_pages.map{ |signature_page| { name: signature_page.tree_element.name, signature_only: !signature_packet_review_document_tree_element_ids.include?(signature_page.tree_element.id) }}.uniq
    signature_page_tree_element_ids                   = signature_pages.map{ |signature_page| signature_page.tree_element.id }
    attached_for_review_only                          = created_signature_packet_review_documents.select{ |signature_packet_review_document| !signature_page_tree_element_ids.include?(signature_packet_review_document.tree_element_id) }.map{ |signature_packet_review_document| signature_packet_review_document.name }
    email                                             = entity_user.user.email
    DealMailer.signature_packet_failed_to_send_email(additional_pages, method_text, signer_name, copy_to, sender, message, document_objects, attached_for_review_only, email).deliver_later
  end
end
