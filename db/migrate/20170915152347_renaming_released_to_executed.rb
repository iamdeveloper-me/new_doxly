class RenamingReleasedToExecuted < ActiveRecord::Migration
  def change
    rename_column :tree_elements, :released_signatures, :executed_signatures
    rename_column :tree_elements, :released_signatures_at, :executed_signatures_at
    rename_column :tree_elements, :released_signatures_deal_entity_user_id, :executed_signatures_deal_entity_user_id
  end
end
