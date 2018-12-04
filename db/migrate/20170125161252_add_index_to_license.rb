class AddIndexToLicense < ActiveRecord::Migration
  def change
    add_index :licenses, :start_date
    add_index :licenses, :end_date
    add_index :licenses, :ended_on
    add_index :licenses, :deal_count
  end
end
