class AddForeignKeyToUnmatchedSignatureUploadPages < ActiveRecord::Migration
  def change
    add_foreign_key :unmatched_signature_upload_pages, :signature_pages, column: :signature_page_id, on_delete: :cascade
    add_foreign_key :unmatched_signature_upload_pages, :unmatched_signature_uploads, column: :unmatched_signature_upload_id, on_delete: :cascade
  end
end
