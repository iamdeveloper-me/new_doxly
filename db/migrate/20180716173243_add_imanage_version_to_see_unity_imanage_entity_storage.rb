class AddImanageVersionToSeeUnityImanageEntityStorage < ActiveRecord::Migration
  def change
    add_column :see_unity_imanage_entity_storages, :imanage_version, :string
  end
end
