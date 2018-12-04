class RemoveIsActiveFromEntityConnection < ActiveRecord::Migration
  def change
    remove_column :entity_connections, :is_active
  end
end
