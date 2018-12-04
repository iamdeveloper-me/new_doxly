class MakeRemindersNotPolymorphic < ActiveRecord::Migration
  def change
    remove_column :reminders, :remindable_id
    remove_column :reminders, :remindable_type
    add_column :reminders, :due_date_id, :integer
  end
end
