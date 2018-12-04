class RemoveApprovedAtFromSignaturePacket < ActiveRecord::Migration
  def change
    remove_column :signature_packets, :approved_at
  end
end
