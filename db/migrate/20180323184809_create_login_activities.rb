class CreateLoginActivities < ActiveRecord::Migration
  def change
    create_table :login_activities do |t|
      t.references :user, index: true
      t.string :email, index: true, :null => false
      t.string :activity, index: true, :null => false, :default => 'login'
      t.string :ip_address, :null => false
      t.text :user_agent, :null => false
      t.text :referrer

      t.timestamps  null: false
    end
  end
end
