class AddConfirmationTokenToOrganizationConnection < ActiveRecord::Migration
  def change
    add_column :organization_connections, :confirmation_token, :string
  end
end
