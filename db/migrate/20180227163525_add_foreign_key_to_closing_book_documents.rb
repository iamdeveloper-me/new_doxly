class AddForeignKeyToClosingBookDocuments < ActiveRecord::Migration
  def change
    add_foreign_key :closing_book_documents, :tree_elements, on_delete: :cascade
  end
end
