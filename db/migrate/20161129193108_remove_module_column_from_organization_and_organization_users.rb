class RemoveModuleColumnFromOrganizationAndOrganizationUsers < ActiveRecord::Migration
  def change
    remove_column :organization_users, :modules
    remove_column :organizations, :modules
  end
end
