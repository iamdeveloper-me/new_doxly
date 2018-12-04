class RenameFinalFileToAttachmentOnClosingBooks < ActiveRecord::Migration
  def change
    rename_column :closing_books, :final_file, :attachment
  end
end
