class AddDefaultValueToEmailDigest < ActiveRecord::Migration
  def change
    change_column_default :organization_users, :email_digest_preference, :short_burst
  end
end
