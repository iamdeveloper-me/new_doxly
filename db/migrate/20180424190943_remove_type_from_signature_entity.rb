class RemoveTypeFromSignatureEntity < ActiveRecord::Migration
  def change
    remove_column :signature_entities, :type
    remove_foreign_key :signing_capacities, :signature_groups
    rename_column :signing_capacities, :signature_group_id, :signature_entity_id
    add_foreign_key :signing_capacities, :signature_entities, on_delete: :cascade, column: :signature_entity_id
  end
end
