class RemoveSignatureStatusByOrganizationUserFromSignaturePages < ActiveRecord::Migration
  def change
    remove_column :signature_pages, :signature_status_by_organization_user_id
  end
end
