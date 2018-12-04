class SetDefaultFalseForIsOwner < ActiveRecord::Migration
  def change
    change_column_default :deal_organizations, :is_owner, false
  end
end
