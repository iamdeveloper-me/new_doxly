class ChangeDefaultEmailNotificationSetting < ActiveRecord::Migration
  def change
    change_column_default(:organization_users, :email_digest_preference, "daily_digest")
  end
end
