class AddCascadeDeleteForSignaturePageCollectionSignaturePage < ActiveRecord::Migration
  def change
    add_foreign_key :signature_pages, :signature_page_collections, on_delete: :cascade
  end
end
