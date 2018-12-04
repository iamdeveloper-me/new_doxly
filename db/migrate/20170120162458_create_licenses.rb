class CreateLicenses < ActiveRecord::Migration
  def change
    create_table :licenses do |t|
      t.integer :organization_id
      t.datetime :start_date
      t.datetime :end_date
      t.datetime :ended_on
      t.integer :deal_count

      t.timestamps null: false
    end
  end
end
