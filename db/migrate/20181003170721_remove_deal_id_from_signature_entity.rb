class RemoveDealIdFromSignatureEntity < ActiveRecord::Migration
  def change
    remove_column :signature_entities, :deal_id, :integer
  end
end
