class AddFileNameToSignaturePacketReviewDocument < ActiveRecord::Migration
  def change
    add_column :signature_packet_review_documents, :file_name, :string
  end
end
