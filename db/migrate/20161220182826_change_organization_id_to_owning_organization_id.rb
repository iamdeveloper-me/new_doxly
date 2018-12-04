class ChangeOrganizationIdToOwningOrganizationId < ActiveRecord::Migration
  def change
    rename_column :deals, :organization_id, :owner_organization_id
  end
end
