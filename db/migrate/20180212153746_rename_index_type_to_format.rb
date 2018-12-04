class RenameIndexTypeToFormat < ActiveRecord::Migration
  def change
    rename_column :closing_books, :index_type, :format
  end
end
