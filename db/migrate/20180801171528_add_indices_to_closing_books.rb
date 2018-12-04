class AddIndicesToClosingBooks < ActiveRecord::Migration
  def change
    add_index :closing_book_documents, :closing_book_section_id
    add_index :closing_book_sections, :closing_book_id

    add_foreign_key :closing_book_documents, :closing_book_sections, on_delete: :cascade
    add_foreign_key :closing_book_sections, :closing_books, on_delete: :cascade
  end
end
