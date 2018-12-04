class RemoveEntitySsoConfigurations < ActiveRecord::Migration
  def change
    drop_table :sso_configurations
  end
end
