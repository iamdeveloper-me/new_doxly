class AddIndexForDueDateIdOnReminders < ActiveRecord::Migration
  def change
    add_index :reminders, :due_date_id
  end
end
