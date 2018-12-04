class RemoveUniqueIndexOnNameForEntity < ActiveRecord::Migration
  def change
    remove_index :entities, :name
    add_index :entities, :name
  end
end
