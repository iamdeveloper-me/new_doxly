class MoveDealOwnerToDealOrganizationFromOrg < ActiveRecord::Migration
  def change
    add_column :deal_organizations, :is_owner, :boolean
  end
end
