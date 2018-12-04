class AddRefreshTokenToSeeUnityImanageUserCredential < ActiveRecord::Migration
  def change
    add_column :see_unity_imanage_user_credentials, :refresh_token, :string, null: false
    change_column_null :see_unity_imanage_user_credentials, :access_token, false
  end
end
