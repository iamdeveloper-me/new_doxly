class ModifyColumnsInUsersOrganizations < ActiveRecord::Migration
  def change
    remove_columns :users, :company, :avatar_uploaded_at
    remove_columns :organizations, :created_by, :phone, :address, :activated
    remove_columns :organization_users, :invitation_accepted, :invitation_token, :type, :record_type

    rename_column :users, :activated, :is_active

    add_column :users, :fax, :string
    add_column :users, :city, :string
    add_column :users, :state, :string
    add_column :users, :zip, :string
    add_column :organization_users, :is_owner, :boolean, :default => false
  end
end
