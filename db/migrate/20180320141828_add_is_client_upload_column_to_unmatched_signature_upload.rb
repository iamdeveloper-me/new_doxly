class AddIsClientUploadColumnToUnmatchedSignatureUpload < ActiveRecord::Migration
  def change
    add_column :unmatched_signature_uploads, :is_client_upload, :boolean, null: false, default: true
  end
end
