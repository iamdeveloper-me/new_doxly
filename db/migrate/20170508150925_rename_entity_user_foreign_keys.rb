class RenameEntityUserForeignKeys < ActiveRecord::Migration
  def change
    rename_column :deal_organization_users, :organization_user_id, :entity_user_id
    rename_column :events, :organization_user_id, :entity_user_id
    rename_column :notes, :organization_user_id, :entity_user_id
    rename_column :reminders, :organization_user_id, :entity_user_id
    rename_column :starred_deals, :organization_user_id, :entity_user_id
    rename_column :signature_packets, :sent_by_organization_user_id, :sent_by_user_id
  end
end
