class CreateHddVersionStorages < ActiveRecord::Migration
  def change
    create_table :hdd_version_storages do |t|
      t.string      :original_path
      t.string      :converted_path
      t.timestamps  null: false
    end
    change_table :versions do |t|
      t.references :version_storageable, polymorphic: true, index: { name: 'versions_on_version_storageable' }
    end
  end
end
