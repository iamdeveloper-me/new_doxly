class AddUniqueKeyToSignaturePageCollection < ActiveRecord::Migration
  def change
    add_column :signature_page_collections, :unique_key, :string
    rename_column :signature_pages, :unique_key, :old_unique_key
  end
end
