class AddDetailStorageDetailableToDeals < ActiveRecord::Migration
  def change
    change_table :deals do |t|
      t.references :deal_storage_detailable, polymorphic: true, index: { name: 'deals_on_deal_storage_detailable' }
    end
  end
end
