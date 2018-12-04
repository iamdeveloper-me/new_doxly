class AddOrganizationUserIdToDealDocumentVersions < ActiveRecord::Migration
  def change
    add_column :deal_document_versions, :organization_user_id, :integer, :null => false

    add_index :deal_document_versions, :organization_user_id
  end
end
