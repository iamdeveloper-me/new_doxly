class RemoveClosingBookIdFromClosingBookDocument < ActiveRecord::Migration
  def change
    remove_column :closing_book_documents, :closing_book_id
  end
end
