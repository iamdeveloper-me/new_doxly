class RemoveBoxAttributesFromVersions < ActiveRecord::Migration
  def change
    remove_column :versions, :file_id
    remove_column :versions, :url
    remove_column :versions, :download_url
  end
end
