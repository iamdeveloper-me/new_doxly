class CreateHddEntityStorages < ActiveRecord::Migration
  def change
    create_table :hdd_entity_storages do |t|
      t.references :entity, index: true, foreign_key: true
      t.string :path

      t.timestamps null: false
    end
  end
end
