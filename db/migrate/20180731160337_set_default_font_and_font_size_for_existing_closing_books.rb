class SetDefaultFontAndFontSizeForExistingClosingBooks < ActiveRecord::Migration
  def change
    ClosingBook.update_all(font: 'Times New Roman', font_size: 12)
  end
end
