class AddNullConstraintToEmailDigestPreference < ActiveRecord::Migration
  def change
    change_column_null :organization_users, :email_digest_preference, false
  end
end
