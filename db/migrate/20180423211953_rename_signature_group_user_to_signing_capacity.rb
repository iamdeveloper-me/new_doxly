class RenameSignatureGroupUserToSigningCapacity < ActiveRecord::Migration
  def change
    rename_table :signature_group_users, :signing_capacities
  end
end
