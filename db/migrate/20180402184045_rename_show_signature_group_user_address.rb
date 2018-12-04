class RenameShowSignatureGroupUserAddress < ActiveRecord::Migration
  def change
    rename_column :tree_elements, :show_signature_group_user_address, :show_address_on_signature_page
  end
end
