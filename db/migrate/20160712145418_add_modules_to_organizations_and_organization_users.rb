class AddModulesToOrganizationsAndOrganizationUsers < ActiveRecord::Migration
  def change
    add_column :organizations, :modules, :text
    add_column :organization_users, :modules, :binary, limit: 5.megabytes
  end
end
