class CreateNetDocumentsDealStorageDetails < ActiveRecord::Migration
  def change
    create_table :dms_deal_storage_details do |t|
      t.references :deal, index: true, foreign_key: true
      t.references :dms_deal_storage_detailable, polymorphic: true, index: { name: 'index_deal_storage_details_on_polymorphic_detailable'}
      t.timestamps  null: false
    end

    create_table :net_documents_deal_storage_details do |t|
      t.string :search_starting_point
    end
  end
end
