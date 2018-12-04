class CreateImanage10DealStorageDetails < ActiveRecord::Migration
  def change
    create_table :imanage10_deal_storage_details do |t|
      t.string :search_starting_point

      t.timestamps  null: false
    end
  end
end
