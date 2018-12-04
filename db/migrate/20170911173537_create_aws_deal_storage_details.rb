class CreateAwsDealStorageDetails < ActiveRecord::Migration
  def change
    create_table :aws_deal_storage_details do |t|
      t.timestamps null: false
    end
  end
end
