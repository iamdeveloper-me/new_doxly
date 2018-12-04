class AddEmailDigestPreferenceToOrganizationUser < ActiveRecord::Migration
  def change
    add_column :organization_users, :email_digest_preference, :string
  end
end
