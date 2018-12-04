class RenameTableToSignaturePacketSignaturePage < ActiveRecord::Migration
  def change
    rename_table :signature_packet_page_links, :signature_packet_signature_pages
  end
end
