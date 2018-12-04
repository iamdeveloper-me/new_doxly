class RemoveDueDateFromDueDateable < ActiveRecord::Migration
  def change
    remove_column :folders, :due_date
    remove_column :tasks, :due_date
    remove_column :documents, :due_date
  end
end
