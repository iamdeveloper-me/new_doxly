class AddForeignKeyToClosingBooks < ActiveRecord::Migration
  def change
    add_foreign_key :closing_books, :deal_entity_users, column: :creator_id, on_delete: :cascade
  end
end
