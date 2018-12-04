class CreateSeeUnityImanageUserCredential < ActiveRecord::Migration
  def change
    create_table :see_unity_imanage_user_credentials do |t|
      t.string :access_token

      t.timestamps  null: false
    end
  end
end
