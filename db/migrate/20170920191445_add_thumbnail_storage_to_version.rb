class AddThumbnailStorageToVersion < ActiveRecord::Migration
  def change
    add_column :versions, :thumbnail_version_storage_id, :integer
  end
end
