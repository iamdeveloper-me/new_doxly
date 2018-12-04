class AddNameToClosingBookDocument < ActiveRecord::Migration
  def change
    add_column :closing_book_documents, :closing_book_section_id, :integer
    add_column :closing_book_documents, :name, :string
    add_column :closing_book_documents, :tab_number, :integer
  end
end
