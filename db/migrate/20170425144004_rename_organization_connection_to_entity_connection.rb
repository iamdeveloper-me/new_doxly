class RenameOrganizationConnectionToEntityConnection < ActiveRecord::Migration
  def change
    rename_table :organization_connections, :entity_connections
  end
end
