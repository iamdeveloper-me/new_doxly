class AddReleasedSignaturesToTreeElement < ActiveRecord::Migration
  def change
    add_column :tree_elements, :released_signatures, :boolean, default: false
    add_column :tree_elements, :released_signatures_at, :datetime
    add_column :tree_elements, :released_signatures_deal_entity_user_id, :integer

    add_foreign_key :tree_elements, :deal_entity_users, column: :released_signatures_deal_entity_user_id
  end
end
