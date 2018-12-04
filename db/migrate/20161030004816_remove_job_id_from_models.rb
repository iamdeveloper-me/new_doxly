class RemoveJobIdFromModels < ActiveRecord::Migration
  def change
    remove_column :reminders, :job_id
    drop_table :notifications
    create_table :scheduled_jobs do |t|
      t.references :schedulable, index: true, polymorphic: true
      t.integer :job_id, index: true
    end
  end
end
