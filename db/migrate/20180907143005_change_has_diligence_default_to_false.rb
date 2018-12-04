class ChangeHasDiligenceDefaultToFalse < ActiveRecord::Migration
  def change
    change_column_default :deals, :has_diligence, false
  end
end
