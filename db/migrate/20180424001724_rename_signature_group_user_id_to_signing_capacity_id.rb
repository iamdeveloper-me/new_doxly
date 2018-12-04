class RenameSignatureGroupUserIdToSigningCapacityId < ActiveRecord::Migration
  def change
    rename_column :signature_pages, :signature_group_user_id, :signing_capacity_id
  end
end
