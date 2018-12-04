class UpdateLicensesColumnNullOptions < ActiveRecord::Migration
  def change
    change_column_null :licenses, :start_date, false
    change_column_null :licenses, :end_date, false
    change_column_null :licenses, :deal_count, false
    change_column_null :licenses, :organization_id, false
  end
end
