class RenameShowSignatureGroupUserToShowSigningCapacity < ActiveRecord::Migration
  def change
    rename_column :tree_elements, :show_signature_group_user_date_signed, :show_signing_capacity_date_signed
  end
end
