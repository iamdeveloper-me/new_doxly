class CreateImanage10UserCredential < ActiveRecord::Migration
  def change
    create_table :imanage10_user_credentials do |t|
      t.string :access_token
      t.string :refresh_token
      t.string :customer_id

      t.timestamps  null: false
    end
  end
end
