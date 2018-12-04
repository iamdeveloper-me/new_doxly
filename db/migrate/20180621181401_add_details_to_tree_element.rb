class AddDetailsToTreeElement < ActiveRecord::Migration
  def change
    add_column :tree_elements, :details, :text
  end
end
