class AddPositionToTreeElement < ActiveRecord::Migration
  def change
    add_column :tree_elements, :position, :integer
  end
end
