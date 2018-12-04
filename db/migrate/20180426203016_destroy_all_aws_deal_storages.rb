class DestroyAllAwsDealStorages < ActiveRecord::Migration
  def up
    drop_table :aws_deal_storage_details
    remove_column :deals, :deal_storage_detailable_id
    remove_column :deals, :deal_storage_detailable_type
  end

  def down
    create_table :aws_deal_storage_details
    add_column :deals, :deal_storage_detailable_id, :integer
    add_column :deals, :deal_storage_detailable_type, :string
  end
end
