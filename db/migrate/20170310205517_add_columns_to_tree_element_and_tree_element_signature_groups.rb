class AddColumnsToTreeElementAndTreeElementSignatureGroups < ActiveRecord::Migration
  def change
    add_column :tree_elements, :signature_page_document_name, :string, null: true
    add_column :tree_elements, :show_signature_page_footer, :boolean, null: false, default: true
    add_column :tree_element_signature_groups, :show_alias, :boolean, null: false, default: true
  end
end
