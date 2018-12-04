class RenameThumbnailStorableToThumbnailStorageable < ActiveRecord::Migration
  def change
    rename_column :thumbnail_storages, :thumbnail_storable_id, :thumbnail_storageable_id
    rename_column :thumbnail_storages, :thumbnail_storable_type, :thumbnail_storageable_type
  end
end
