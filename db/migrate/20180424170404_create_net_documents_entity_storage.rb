class CreateNetDocumentsEntityStorage < ActiveRecord::Migration
  def change
    create_table :net_documents_entity_storages do |t|
      t.references :entity, index: true
      t.integer :document_retention_minutes_duration
      t.string :instance_location

      t.timestamps  null: false
    end
  end
end
