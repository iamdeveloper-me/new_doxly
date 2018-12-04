class SignaturePacketSignaturePageToSignaturePageCollection < ActiveRecord::Migration
  def change
    remove_foreign_key :signature_packet_signature_pages, :signature_pages
    add_reference :signature_packet_signature_pages, :signature_page_collection, index: { name: 'signature_packet_signature_pages_on_signature_page_collection' }, on_delete: :cascade
  end
end
