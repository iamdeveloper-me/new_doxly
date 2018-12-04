class AddIntrosCompletedToOrganizationUser < ActiveRecord::Migration
  def change
    add_column :organization_users, :intros_completed, :string, array: true, default: []
  end
end
