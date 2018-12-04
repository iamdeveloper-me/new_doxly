class RemoveErrorMessageFromClosingBookDocument < ActiveRecord::Migration
  def change
    remove_column :closing_book_documents, :error_message
  end
end
