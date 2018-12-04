class Api::V1::UnmatchedSignatureUploadsController < Api::V1::ApplicationController
  include Controllers::Api::ChecklistHelpers

  api!
  def index
    check_update(:signature_management)
    render_success(run_array_serializer(deal.unmatched_signature_uploads, UnmatchedSignatureUploadSerializer))
  end

  api!
  def remove
    check_update(:signature_management)

    # collect only the pages in the upload that are going to be removed
    pages_to_be_removed = unmatched_signature_upload.unmatched_signature_upload_pages.unmatched

    # update the status of each page
    pages_to_be_removed.each do |unmatched_signature_upload_page|
      unmatched_signature_upload_page.removed!
    end

    render_success(run_object_serializer(unmatched_signature_upload, UnmatchedSignatureUploadSerializer))
  end

  api!
  def undo_removed
    check_update(:signature_management)

    # collect all of the removed pages
    pages_to_be_restored = unmatched_signature_upload.unmatched_signature_upload_pages.removed

    # change the status of each removed page back to unmatched
    pages_to_be_restored.each do |unmatched_signature_upload_page|
      unmatched_signature_upload_page.undo_removed!
    end

    render_success(run_object_serializer(unmatched_signature_upload, UnmatchedSignatureUploadSerializer))
  end

  private

  def unmatched_signature_upload
    @unmatched_signature_upload ||= deal.unmatched_signature_uploads.find(params[:unmatched_signature_upload_id])
  end

end
