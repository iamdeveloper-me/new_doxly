class CreateImanage10VersionStorage < ActiveRecord::Migration
  def change
    create_table :imanage10_version_storages do |t|
      t.jsonb :imanage10_version_object, index: { name: 'index_on_imanage10_version_object', using: :gin }

      t.timestamps  null: false
    end
  end
end
