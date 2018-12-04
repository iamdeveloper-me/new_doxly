class DropTableSignatureEnvelopes < ActiveRecord::Migration
  def change
    drop_table :signature_envelopes
  end
end
