class MakeThumbnailVersionStorageBelongToVersion < ActiveRecord::Migration
  def change
    remove_column :versions, :thumbnail_version_storage_id, :integer
    add_column :thumbnail_version_storages, :version_id, :integer
  end
end
