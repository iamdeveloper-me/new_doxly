class RenameOrganizationsId < ActiveRecord::Migration
  def change
    rename_column :sso_configurations, :organizations_id, :organization_id
  end
end
