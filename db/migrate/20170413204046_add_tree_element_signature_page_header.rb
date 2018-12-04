class AddTreeElementSignaturePageHeader < ActiveRecord::Migration
  def change
    add_column :tree_elements, :show_signature_page_header, :boolean, null: false, default: false
    add_column :tree_elements, :signature_page_header_text, :string, null: true
  end
end
