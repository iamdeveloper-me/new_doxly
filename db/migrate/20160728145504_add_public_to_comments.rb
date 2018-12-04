class AddPublicToComments < ActiveRecord::Migration
  def change
    add_column :comments, :is_public, :boolean, :null => false, :default => false
    remove_column :comments, :comment_type
  end
end
