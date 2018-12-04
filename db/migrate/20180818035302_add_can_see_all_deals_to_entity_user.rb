class AddCanSeeAllDealsToEntityUser < ActiveRecord::Migration
  def change
    add_column :entity_users, :can_see_all_deals, :boolean, default: false

    add_index :entity_users, :can_see_all_deals
  end
end
