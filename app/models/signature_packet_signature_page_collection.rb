class SignaturePacketSignaturePageCollection < ActiveRecord::Base
  belongs_to :signature_packet
  belongs_to :signature_page_collection

  validates_presence_of :signature_packet, :signature_page_collection
  validates_uniqueness_of :signature_packet_id, { scope: :signature_page_collection_id }
end
