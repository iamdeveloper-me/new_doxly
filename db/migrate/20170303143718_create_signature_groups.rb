class CreateSignatureGroups < ActiveRecord::Migration
  def change
    create_table :signature_groups do |t|
      t.string :name
      t.string :ancestry
      t.references :deal, index: true

      t.timestamps null: false

    end
  end
end
