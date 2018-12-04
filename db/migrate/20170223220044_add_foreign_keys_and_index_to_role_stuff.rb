class AddForeignKeysAndIndexToRoleStuff < ActiveRecord::Migration
  def change
    add_foreign_key :role_links, :roles, on_delete: :cascade
    add_index :roles, :name
  end
end
