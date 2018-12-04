class RenameDealEntityForeignKeys < ActiveRecord::Migration
  def change
    rename_column :deal_organization_users, :deal_organization_id, :deal_entity_id
    rename_column :completion_statuses, :deal_organization_id, :deal_entity_id
    rename_column :responsible_parties, :deal_organization_id, :deal_entity_id
  end
end
