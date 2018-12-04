class AddIsCounselToOrganiations < ActiveRecord::Migration
  def change
    # default to true for existing organizations
    add_column :organizations, :is_counsel, :boolean, :null => false, :default => true
    add_index  :organizations, :is_counsel

    # remove default
    change_column_default :organizations, :is_counsel, false
  end
end
