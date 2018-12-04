class AddErrorMessageToClosingBookDocument < ActiveRecord::Migration
  def change
    add_column :closing_book_documents, :error_message, :text
  end
end
