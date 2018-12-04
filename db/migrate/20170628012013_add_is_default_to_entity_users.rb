class AddIsDefaultToEntityUsers < ActiveRecord::Migration
  def change
    add_column :entity_users, :is_default, :boolean, null: false, default: false
  end
end