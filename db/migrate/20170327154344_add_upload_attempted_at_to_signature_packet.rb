class AddUploadAttemptedAtToSignaturePacket < ActiveRecord::Migration
  def change
    add_column :signature_packets, :upload_attempted_at, :datetime
  end
end
