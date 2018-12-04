class Rename < ActiveRecord::Migration
  def change
    rename_column :to_dos, :deal_organization_id, :deal_entity_id
    rename_column :to_dos, :deal_organization_user_id, :deal_entity_user_id
  end
end
