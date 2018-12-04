class RemoveIsExecutedFromVersion < ActiveRecord::Migration
  def change
    remove_column :versions, :is_executed
  end
end
