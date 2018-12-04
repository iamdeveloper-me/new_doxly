class AddSignatureFieldsToDealDocuments < ActiveRecord::Migration
  def change
    add_column :deal_documents, :use_signature, :boolean
    add_column :deal_documents, :signature_type, :string
    add_column :deal_documents, :signature_envelope_id, :string
    add_column :deal_documents, :signature_sent_at, :datetime
    add_column :deal_documents, :signature_executed_at, :datetime
    add_column :deal_documents, :signature_status, :string
    add_column :deal_documents, :status, :string

    add_index :deal_documents, :use_signature
    add_index :deal_documents, :signature_type
    add_index :deal_documents, :signature_envelope_id
    add_index :deal_documents, :signature_status
    add_index :deal_documents, :status
  end
end
