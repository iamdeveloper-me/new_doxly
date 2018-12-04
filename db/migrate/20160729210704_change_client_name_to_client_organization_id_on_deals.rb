class ChangeClientNameToClientOrganizationIdOnDeals < ActiveRecord::Migration
  def change
    remove_column :deals, :client_name
    add_column :deals, :client_organization_id, :integer
  end
end
