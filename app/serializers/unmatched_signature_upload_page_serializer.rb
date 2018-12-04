class UnmatchedSignatureUploadPageSerializer < ApplicationSerializer
  include Rails.application.routes.url_helpers
  include Controllers::FileSender

  attributes :id, :status, :page_number, :unmatched_signature_upload_id, :url

  belongs_to  :signature_page

  def url
    ApplicationHelper.viewer_url(viewer_path)
  end

  private

  def viewer_path
    view_deal_unmatched_signature_upload_unmatched_signature_upload_page_path(object.unmatched_signature_upload.deal_id, object.unmatched_signature_upload.id, object.id)
  end
end
