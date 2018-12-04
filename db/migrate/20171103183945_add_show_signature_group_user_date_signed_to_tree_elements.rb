class AddShowSignatureGroupUserDateSignedToTreeElements < ActiveRecord::Migration
  def change
    add_column :tree_elements, :show_signature_group_user_date_signed, :boolean, null: false, default: false
  end
end
