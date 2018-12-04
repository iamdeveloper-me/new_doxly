class AddPositionToPreviousTreeElements < ActiveRecord::Migration
  def change
    TreeElement.all.each do |tree_element|
      tree_element.children.order(:id).each.with_index(1) do |child, index|
        child.update_column(:position, index)
      end
    end
  end
end
