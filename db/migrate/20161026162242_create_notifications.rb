class CreateNotifications < ActiveRecord::Migration
  def change
    create_table :notifications do |t|
      t.references :organization_user, index: true
      t.references :delayed_job, index: true
    end
  end
end
