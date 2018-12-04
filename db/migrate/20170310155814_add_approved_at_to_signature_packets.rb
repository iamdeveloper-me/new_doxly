class AddApprovedAtToSignaturePackets < ActiveRecord::Migration
  def change
    add_column :signature_packets, :approved_at, :datetime
  end
end
