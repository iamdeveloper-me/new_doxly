class AddDealForeignKeyToUnmatchedSignatureUploads < ActiveRecord::Migration
  def change
    add_foreign_key :unmatched_signature_uploads, :deals, column: :deal_id, on_delete: :cascade
  end
end
