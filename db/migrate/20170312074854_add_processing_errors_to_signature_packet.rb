class AddProcessingErrorsToSignaturePacket < ActiveRecord::Migration
  def change
    add_column :signature_packets, :processing_errors, :string
  end
end
