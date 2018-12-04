class ChangeStringsToIntegersOnDealOrganizations < ActiveRecord::Migration
  def change
    change_column :deal_organizations, :deal_id,  'integer USING CAST(deal_id AS integer)'
    change_column :deal_organizations, :organization_id,  'integer USING CAST(organization_id AS integer)'
  end
end
