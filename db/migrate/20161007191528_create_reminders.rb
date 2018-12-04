class CreateReminders < ActiveRecord::Migration
  def change
    create_table :reminders do |t|
      t.integer :remindable_id
      t.string :remindable_type
      t.references :organization_user, index: true
      t.integer :value
      t.string :unit
      t.string :message

      t.timestamps null: false
    end
  end
end
