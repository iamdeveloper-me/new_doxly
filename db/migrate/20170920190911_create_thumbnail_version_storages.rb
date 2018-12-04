class CreateThumbnailVersionStorages < ActiveRecord::Migration
  def change
    create_table :thumbnail_version_storages do |t|
      t.string      :thumbnails_folder_key
      t.integer     :thumbnail_count
      t.timestamps  null: false
    end
  end
end
