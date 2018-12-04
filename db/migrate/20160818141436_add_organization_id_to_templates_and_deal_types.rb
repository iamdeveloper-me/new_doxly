class AddOrganizationIdToTemplatesAndDealTypes < ActiveRecord::Migration
  def change
    add_column :deal_types, :organization_id, :integer, :null => true
    add_column :templates, :organization_id, :integer, :null => true
  end
end
