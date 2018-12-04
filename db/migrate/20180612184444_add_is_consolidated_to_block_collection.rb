class AddIsConsolidatedToBlockCollection < ActiveRecord::Migration
  def change
    add_column :block_collections, :is_consolidated, :boolean, default: false
  end
end
