class CreateDueDates < ActiveRecord::Migration
  def change
    create_table :due_dates do |t|
      t.datetime :value
      t.references :due_dateable, index: true, polymorphic: true

      t.timestamps null: false
    end

    add_index :due_dates, [:due_dateable_id, :due_dateable_type]
  end
end
