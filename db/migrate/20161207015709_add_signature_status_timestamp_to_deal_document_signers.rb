class AddSignatureStatusTimestampToDealDocumentSigners < ActiveRecord::Migration
  def change
    add_column :deal_document_signers, :signature_status_timestamp, :datetime
  end
end
