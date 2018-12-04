class AddForeignKeyToUnmatchedSignatureUploads < ActiveRecord::Migration
  def change
    add_foreign_key :unmatched_signature_uploads, :users, column: :uploader_id, on_delete: :cascade
  end
end
