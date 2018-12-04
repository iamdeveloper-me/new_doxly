class AddFieldsToSignaturePacket < ActiveRecord::Migration
  def change
    add_column :signature_packets, :copy_to, :string
    add_column :signature_packets, :message, :text
  end
end
