class RenameOrganizationUserToEntityUser < ActiveRecord::Migration
  def change
    rename_table :organization_users, :entity_users
  end
end
