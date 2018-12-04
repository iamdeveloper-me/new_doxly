class CreateAwsEntityStorages < ActiveRecord::Migration
  def change
    create_table :aws_entity_storages do |t|
      t.references :entity, index: true, foreign_key: true
      t.boolean :allowed, default: true
      t.string :bucket

      t.timestamps null: false
    end
  end
end
