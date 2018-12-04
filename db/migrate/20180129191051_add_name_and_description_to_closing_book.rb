class AddNameAndDescriptionToClosingBook < ActiveRecord::Migration
  def change
    add_column :closing_books, :name, :string
    add_column :closing_books, :description, :text
  end
end
