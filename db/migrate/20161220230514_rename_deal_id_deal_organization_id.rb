class RenameDealIdDealOrganizationId < ActiveRecord::Migration
  def change
    add_column :deal_organization_users, :deal_organization_id, :integer
  end
end
