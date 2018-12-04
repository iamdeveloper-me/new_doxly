class AddDealIdToUnmatchedSignatureUploads < ActiveRecord::Migration
  def change
    add_column :unmatched_signature_uploads, :deal_id, :integer, :null => false
  end
end
