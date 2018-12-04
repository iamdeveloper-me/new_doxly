class RenameDealOrganizationDealEntity < ActiveRecord::Migration
  def change
    rename_table :deal_organizations, :deal_entities
  end
end
