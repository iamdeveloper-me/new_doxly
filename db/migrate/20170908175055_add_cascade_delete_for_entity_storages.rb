class AddCascadeDeleteForEntityStorages < ActiveRecord::Migration
  def change
    remove_foreign_key :hdd_entity_storages, :entities
    remove_foreign_key :aws_entity_storages, :entities
    add_foreign_key :hdd_entity_storages, :entities, on_delete: :cascade
    add_foreign_key :aws_entity_storages, :entities, on_delete: :cascade
  end
end
