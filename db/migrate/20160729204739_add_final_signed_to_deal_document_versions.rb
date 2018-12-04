class AddFinalSignedToDealDocumentVersions < ActiveRecord::Migration
  def change
    add_column :deal_document_versions, :is_final, :boolean, :null => false, :default => false
    add_column :deal_document_versions, :is_final_at, :datetime
    add_column :deal_document_versions, :is_signed, :boolean, :null => false, :default => false
  end
end
