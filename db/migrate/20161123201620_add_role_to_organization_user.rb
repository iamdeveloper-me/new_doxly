class AddRoleToOrganizationUser < ActiveRecord::Migration
  def change
    add_column :organization_users, :role, :string, :default => :standard_user
    add_column :deal_organization_users, :role, :string
  end
end
