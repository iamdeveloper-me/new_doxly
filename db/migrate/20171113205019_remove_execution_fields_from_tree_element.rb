class RemoveExecutionFieldsFromTreeElement < ActiveRecord::Migration
  def change
    remove_column :tree_elements, :executed_signatures
    remove_column :tree_elements, :executed_signatures_at
    remove_column :tree_elements, :executed_signatures_deal_entity_user_id
  end
end
