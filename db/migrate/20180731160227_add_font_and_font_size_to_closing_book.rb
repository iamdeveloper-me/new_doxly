class AddFontAndFontSizeToClosingBook < ActiveRecord::Migration
  def change
    add_column :closing_books, :font, :string
    add_column :closing_books, :font_size, :integer
  end
end
