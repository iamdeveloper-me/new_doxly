class AddPacketTypeToSignaturePackets < ActiveRecord::Migration
  def change
    # add the default first so the existing packets will all get a value
    add_column :signature_packets, :packet_type, :string, null: false, default: 'email'

    # remove the default
   change_column_default :signature_packets, :packet_type, nil
  end
end
