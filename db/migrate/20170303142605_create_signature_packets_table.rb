class CreateSignaturePacketsTable < ActiveRecord::Migration
  def change
    create_table :signature_packets do |t|
      t.references :user, index: true
      t.references :deal, index: true

      t.timestamps null: false
    end
  end
end
