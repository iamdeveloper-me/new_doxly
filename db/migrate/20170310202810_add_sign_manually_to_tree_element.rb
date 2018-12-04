class AddSignManuallyToTreeElement < ActiveRecord::Migration
  def change
    add_column :tree_elements, :sign_manually, :boolean
  end
end
