class CreateDealDocumentSigners < ActiveRecord::Migration
  def change
    create_table :deal_document_signers do |t|
      t.integer :deal_document_id
      t.integer :deal_collaborator_id
      t.datetime :signature_completed_at
      t.string :signature_recipient_id
      t.string :signature_status

      t.timestamps
    end
    
    add_index :deal_document_signers, :deal_document_id
    add_index :deal_document_signers, :deal_collaborator_id
    add_index :deal_document_signers, :signature_status

    add_foreign_key :deal_document_signers, :deal_documents, on_delete: :cascade
    add_foreign_key :deal_document_signers, :deal_collaborators, on_delete: :cascade
  end
end
