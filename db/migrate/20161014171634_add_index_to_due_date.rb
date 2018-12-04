class AddIndexToDueDate < ActiveRecord::Migration
  def change
    add_index :due_dates, :organization_id
  end
end
