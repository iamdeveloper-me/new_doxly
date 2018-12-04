class AddFieldsToClosingBooks < ActiveRecord::Migration
  def change
    add_column :closing_books, :logo, :string
    add_column :closing_books, :final_file, :string
    add_column :closing_books, :cover_text, :text
  end
end
