class AddPacketPageNumberToSignaturePage < ActiveRecord::Migration
  def change
    add_column :signature_pages, :packet_page_number, :integer
  end
end
