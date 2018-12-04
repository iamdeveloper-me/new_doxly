class NewOrganizationConnectionColumns < ActiveRecord::Migration
  def change
    add_column :organization_connections, :is_pending, :boolean
  end
end
