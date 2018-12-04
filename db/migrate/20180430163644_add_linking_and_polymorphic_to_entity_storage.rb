class AddLinkingAndPolymorphicToEntityStorage < ActiveRecord::Migration
  def change
    create_table :dms_entity_storages do |t|
      t.references :entity, index: true, foreign_key: true
      t.references :dms_entity_storageable, polymorphic: true, index: { name: 'index_dms_entity_storages_to_dms_entity_storageable' }
    end

    remove_column :net_documents_entity_storages, :entity_id, :integer
  end
end
