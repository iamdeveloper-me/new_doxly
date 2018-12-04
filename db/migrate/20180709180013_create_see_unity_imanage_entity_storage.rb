class CreateSeeUnityImanageEntityStorage < ActiveRecord::Migration
  def change
    create_table :see_unity_imanage_entity_storages do |t|
      t.integer :document_retention_minutes_duration
      t.string :see_unity_instance_url

      t.timestamps  null: false
    end
  end
end
