class FixThumbnailKeys < ActiveRecord::Migration
  def change
    remove_column :thumbnail_storages, :thumbnails_folder_key, :string
    remove_column :thumbnail_storages, :thumbnail_count, :integer
  end
end
