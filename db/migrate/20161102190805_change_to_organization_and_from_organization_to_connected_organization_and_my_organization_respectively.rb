class ChangeToOrganizationAndFromOrganizationToConnectedOrganizationAndMyOrganizationRespectively < ActiveRecord::Migration
  def change
    rename_column :organization_connections, :to_organization_id, :connected_organization_id
    rename_column :organization_connections, :from_organization_id, :my_organization_id
  end
end
