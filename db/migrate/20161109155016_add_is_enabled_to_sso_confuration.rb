class AddIsEnabledToSsoConfuration < ActiveRecord::Migration
  def change
    add_column :sso_configurations, :is_enabled, :boolean, null: false
  end
end
