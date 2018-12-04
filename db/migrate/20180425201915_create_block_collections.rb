class CreateBlockCollections < ActiveRecord::Migration
  def change
    create_table :block_collections do |t|
      t.references :signature_group, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
