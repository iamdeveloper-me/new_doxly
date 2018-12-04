class AddCreatorIdToClosingBooks < ActiveRecord::Migration
  def change
    add_column :closing_books, :creator_id, :integer
  end
end
