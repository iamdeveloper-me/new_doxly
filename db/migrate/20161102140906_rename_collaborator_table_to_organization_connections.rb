class RenameCollaboratorTableToOrganizationConnections < ActiveRecord::Migration
  def change
    rename_table :collaborators, :organization_connections
  end
end
