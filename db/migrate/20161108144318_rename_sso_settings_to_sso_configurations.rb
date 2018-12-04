class RenameSsoSettingsToSsoConfigurations < ActiveRecord::Migration
  def change
    rename_table :sso_settings, :sso_configurations
  end
end
