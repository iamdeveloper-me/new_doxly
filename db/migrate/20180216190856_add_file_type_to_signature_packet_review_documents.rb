class AddFileTypeToSignaturePacketReviewDocuments < ActiveRecord::Migration
  def change
    add_column :signature_packet_review_documents, :file_type, :string
  end
end
