class RenameOrganizationConnectionKeys < ActiveRecord::Migration
  def change
    rename_column :organization_connections, :my_organization_id, :my_entity_id
    rename_column :organization_connections, :connected_organization_id, :connected_entity_id
  end
end
