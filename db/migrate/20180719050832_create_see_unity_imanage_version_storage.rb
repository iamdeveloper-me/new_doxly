class CreateSeeUnityImanageVersionStorage < ActiveRecord::Migration
  def change
    create_table :see_unity_imanage_version_storages do |t|
      t.jsonb :see_unity_imanage_version_object, index: { name: 'index_on_see_unity_imanage_version_object', using: :gin }

      t.timestamps  null: false
    end
  end
end
