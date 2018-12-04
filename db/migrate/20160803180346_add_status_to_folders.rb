class AddStatusToFolders < ActiveRecord::Migration
  def change
    add_column :folders, :status, :string

    add_index :folders, :status
  end
end
