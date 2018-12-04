class CreateClosingBookSections < ActiveRecord::Migration
  def change
    create_table :closing_book_sections do |t|
      t.string :name
      t.integer :tree_element_id
      t.integer :closing_book_id
      t.integer :position

      t.timestamps null: false
    end
  end
end
