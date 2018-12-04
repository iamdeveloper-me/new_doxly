class AddEnabledToUsers < ActiveRecord::Migration
  def change
    add_column :users, :is_enabled, :boolean, :default => true
  end
end
