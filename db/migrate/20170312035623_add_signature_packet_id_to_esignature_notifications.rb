class AddSignaturePacketIdToEsignatureNotifications < ActiveRecord::Migration
  def change
    add_column :esignature_notifications, :signature_packet_id, :string

    add_index :esignature_notifications, :signature_packet_id

    remove_foreign_key :esignature_notifications, :tree_elements
    change_column :esignature_notifications, :tree_element_id, :string, :null => true
  end
end
