class AddErrorDetailToCriticalErrors < ActiveRecord::Migration
  def change
    add_column :critical_errors, :error_detail, :text, :null => true
  end
end
