class RemoveBoxAttributesFromSignaturePackets < ActiveRecord::Migration
  def change
    remove_column :signature_packets, :file_id
    remove_column :signature_packets, :url
    remove_column :signature_packets, :download_url
    remove_column :signature_packets, :signed_url
    remove_column :signature_packets, :signed_download_url
  end
end
