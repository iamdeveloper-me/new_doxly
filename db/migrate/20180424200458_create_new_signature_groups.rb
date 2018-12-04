class CreateNewSignatureGroups < ActiveRecord::Migration
  def change
    create_table :signature_groups do |t|
      t.references :deal, index: true, foreign_key: true
      t.string :name, :null => false

      t.timestamps null: false
    end
  end
end
