class AddJobIdToReminders < ActiveRecord::Migration
  def change
    add_column :reminders, :job_id, :integer
  end
end
