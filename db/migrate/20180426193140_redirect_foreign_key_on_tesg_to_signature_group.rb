class RedirectForeignKeyOnTesgToSignatureGroup < ActiveRecord::Migration
  def change
    rename_column :tree_element_signature_groups, :signature_group_id, :signature_entity_id
    remove_foreign_key :tree_element_signature_groups, :signature_entities
    add_reference :tree_element_signature_groups, :signature_group, on_delete: :cascade, foreign_key: true
  end
end
