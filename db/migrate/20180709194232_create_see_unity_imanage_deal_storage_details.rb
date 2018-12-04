class CreateSeeUnityImanageDealStorageDetails < ActiveRecord::Migration
  def change
    create_table :see_unity_imanage_deal_storage_details do |t|
      t.string :search_starting_point
      
      t.timestamps  null: false
    end
  end
end
