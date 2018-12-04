class ChangeErrorInConversionsToBoolean < ActiveRecord::Migration
  def change
    rename_column :conversions, :error, :is_successful
    change_column :conversions, :is_successful, 'boolean USING CAST(is_successful AS boolean)', :default => false, :null => false
  end
end
