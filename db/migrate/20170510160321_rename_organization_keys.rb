class RenameOrganizationKeys < ActiveRecord::Migration
  def change
    rename_column :deals, :owner_organization_id, :owner_entity_id
    rename_column :deals, :released_signatures_organization_user_id, :released_signatures_entity_user_id
    rename_column :assignment_statuses, :incompleted_by_organization_user_id, :incompleted_by_entity_user_id
  end
end
