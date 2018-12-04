class AddConnectorIdAndDatabaseIdToSeeUnityEntityStorage < ActiveRecord::Migration
  def change
    rename_column :see_unity_imanage_entity_storages, :imanage_version, :connector_id
    add_column :see_unity_imanage_entity_storages, :database_id, :string
  end
end
