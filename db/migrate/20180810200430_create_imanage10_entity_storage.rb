class CreateImanage10EntityStorage < ActiveRecord::Migration
  def change
    create_table :imanage10_entity_storages do |t|
      t.integer :document_retention_minutes_duration
      t.string :imanage10_instance_url
      t.string :library_id

      t.timestamps  null: false
    end
  end
end
