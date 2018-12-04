class Api::V1::UnmatchedSignatureUploadPagesController < Api::V1::ApplicationController
  include Controllers::Api::ChecklistHelpers

  api!
  def manually_match
    check_update(:signature_management)

    # make sure the page isn't complete
    if signature_page.complete?
      render_validation_failed(["Signature page already completed."])
      return
    end

    # update unmatched signature upload page
    unmatched_signature_upload_page.manually_matched!(signature_page)

    # update signature page
    signature_page.signed!(unmatched_signature_upload_page.unmatched_page_aws_file.path)

    # if docusign packet, convert to manual
    if signature_packet.docusign_envelope_id
      signature_packet.deal.owner_entity.esignature_provider.void_envelope(signature_packet.docusign_envelope_id)
      signature_packet.docusign_envelope_id = nil
      signature_packet.save

      # update other signature pages
      signature_packet.signature_pages.opened.each do |signature_page|
        signature_page.update(signature_status: signature_packet.get_packet_type_awaiting_signature_status)
      end
    end

    # update packet
    UpdateSignaturePacket.perform_later(signature_packet)

    render_success(run_object_serializer(unmatched_signature_upload_page, UnmatchedSignatureUploadPageSerializer))
  end

  api!
  def undo_manually_matched
    check_update(:signature_management)

    # validate
    render_validation_failed([t('errors.models.unmatched_signature_upload_page.cannot_undo')]) and return if signature_page.currently_executed?

    # update signature page
    signature_page.ready!

    # update packet, destroy the packet if there was only one page in it
    if signature_packet.signature_pages.where(signature_status: 'signed').any?
      UpdateSignaturePacket.perform_later(signature_packet)
    elsif signature_packet.signed_aws_file
      signature_packet.signed_aws_file.destroy
    end

    # update unmatched signature upload page
    unmatched_signature_upload_page.unmatched!

    render_success(run_object_serializer(unmatched_signature_upload_page, UnmatchedSignatureUploadPageSerializer))
  end

  private

  def unmatched_signature_upload
    @unmatched_signature_upload ||= deal.unmatched_signature_uploads.find(params[:unmatched_signature_upload_id])
  end

  def unmatched_signature_upload_page
    @unmatched_signature_upload_page ||= unmatched_signature_upload.unmatched_signature_upload_pages.find(params[:unmatched_signature_upload_page_id])
  end

  def signature_page
    @signature_page ||= params[:signature_page_id] ? deal.signature_pages.find(params[:signature_page_id]) : unmatched_signature_upload_page.signature_page
  end

  def signature_packet
    @signature_packet ||= signature_page.signature_page_collection.signature_packet
  end

end
