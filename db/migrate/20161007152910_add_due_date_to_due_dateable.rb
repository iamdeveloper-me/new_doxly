class AddDueDateToDueDateable < ActiveRecord::Migration
  def change
    add_column :folders, :due_date, :datetime
    add_column :documents, :due_date, :datetime
  end
end
