class RemoveOwnerEntityIdFromDeals < ActiveRecord::Migration
  def change
    remove_column :deals, :owner_entity_id
  end
end
