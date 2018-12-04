class RenameSignaturePacketSignaturePageToSignaturePacketSignaturePageCollection < ActiveRecord::Migration
  def change
    remove_index :signature_packet_signature_pages, :signature_packet_id
    remove_index :signature_packet_signature_pages, :signature_page_id
    rename_table :signature_packet_signature_pages, :signature_packet_signature_page_collections
    add_index :signature_packet_signature_page_collections, :signature_packet_id, name: 'signature_packet_signature_page_collections_on_signature_packet'
    add_index :signature_packet_signature_page_collections, :signature_page_id, name: 'signature_packet_signature_page_collections_on_signature_page'
    remove_foreign_key :signature_pages, :tree_element_signature_groups
    add_reference :signature_pages, :signature_page_collection, index: { name: 'signature_page_collections_on_signature_pages'}, on_delete: :cascade
  end
end
