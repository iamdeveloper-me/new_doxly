class UnmatchedSignatureUploadSerializer < ApplicationSerializer
  attributes :id, :deal_id, :created_at, :uploader_id, :file_name, :is_client_upload

  has_many   :unmatched_signature_upload_pages
  belongs_to :uploader

end
