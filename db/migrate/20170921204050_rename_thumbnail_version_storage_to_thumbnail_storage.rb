class RenameThumbnailVersionStorageToThumbnailStorage < ActiveRecord::Migration
  def change
    rename_table :thumbnail_version_storages, :thumbnail_storages
  end
end
