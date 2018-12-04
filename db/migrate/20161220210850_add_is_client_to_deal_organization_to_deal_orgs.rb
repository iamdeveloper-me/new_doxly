class AddIsClientToDealOrganizationToDealOrgs < ActiveRecord::Migration
  def change
    add_column :deal_organizations, :is_client, :boolean
  end
end
