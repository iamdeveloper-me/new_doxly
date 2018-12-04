class RenameCommentsToNotes < ActiveRecord::Migration
  def change
    rename_table  :comments, :notes
  end
end
