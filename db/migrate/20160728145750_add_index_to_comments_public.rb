class AddIndexToCommentsPublic < ActiveRecord::Migration
  def change
    add_index :comments, :is_public
  end
end
