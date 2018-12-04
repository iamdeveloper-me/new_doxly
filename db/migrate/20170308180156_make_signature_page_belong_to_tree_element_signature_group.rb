class MakeSignaturePageBelongToTreeElementSignatureGroup < ActiveRecord::Migration
  def change
    remove_reference :signature_pages, :tree_element
    add_reference :signature_pages, :tree_element_signature_group
    add_foreign_key :signature_pages, :tree_element_signature_groups, on_delete: :cascade
  end
end
