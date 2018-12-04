class RemoveColumnsFromNotes < ActiveRecord::Migration
  def change
    remove_column :notes, :deal_id, :integer
    remove_column :notes, :ownable_id, :integer
    remove_column :notes, :ownable_type, :string
  end
end
