class RenameNotesColumns < ActiveRecord::Migration
  def change
    rename_column :notes, :comment, :text
    rename_column :notes, :commentable_id, :noteable_id
    rename_column :notes, :commentable_type, :noteable_type
  end
end
