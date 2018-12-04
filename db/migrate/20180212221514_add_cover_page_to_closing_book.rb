class AddCoverPageToClosingBook < ActiveRecord::Migration
  def change
    add_column :closing_books, :cover_page, :string
  end
end
