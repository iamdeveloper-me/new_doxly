class DropDealIdFromCriticalErrors < ActiveRecord::Migration
  def change
    remove_column :critical_errors, :deal_id
  end
end
