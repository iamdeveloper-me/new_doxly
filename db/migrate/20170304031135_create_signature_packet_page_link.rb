class CreateSignaturePacketPageLink < ActiveRecord::Migration
  def change
    create_table :signature_packet_page_links do |t|
      t.references :signature_page, index: true
      t.references :signature_packet, index: true

      t.timestamps null: false
    end
  end
end
