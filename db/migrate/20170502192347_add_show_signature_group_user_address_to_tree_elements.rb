class AddShowSignatureGroupUserAddressToTreeElements < ActiveRecord::Migration
  def change
    add_column :tree_elements, :show_signature_group_user_address, :boolean, null: false, default: false
  end
end
