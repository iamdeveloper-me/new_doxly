class AddSignatureRequiredToTreeElement < ActiveRecord::Migration
  def change
    add_column :tree_elements, :signature_required, :boolean, null: false, default: false
  end
end
