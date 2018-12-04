class RenameOrganizationIdToEntityId < ActiveRecord::Migration
  def change
    rename_column :deal_organizations, :organization_id, :entity_id
    rename_column :deal_types, :organization_id, :entity_id
    rename_column :due_dates, :organization_id, :entity_id
    rename_column :esignature_providers, :organization_id, :entity_id
    rename_column :events, :organization_id, :entity_id
    rename_column :licenses, :organization_id, :entity_id
    rename_column :organization_users, :organization_id, :entity_id
    rename_column :sso_configurations, :organization_id, :entity_id
    rename_column :templates, :organization_id, :entity_id
    rename_column :assignment_statuses, :organization_id, :entity_id
  end
end
