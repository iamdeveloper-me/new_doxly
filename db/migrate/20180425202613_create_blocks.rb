class CreateBlocks < ActiveRecord::Migration
  def change
    create_table :blocks do |t|
      t.references :block_collection, index: true, foreign_key: true
      t.integer :position

      t.timestamps null: false
    end
  end
end
