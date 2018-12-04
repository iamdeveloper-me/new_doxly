class MakeThumbnailStoragePolymorphic < ActiveRecord::Migration
  def change
    remove_column :thumbnail_storages, :version_id, :integer
    add_reference :thumbnail_storages, :thumbnail_storable, polymorphic: true, index: { name: 'thumbnail_storages_on_thumbnail_storable' }
  end
end
