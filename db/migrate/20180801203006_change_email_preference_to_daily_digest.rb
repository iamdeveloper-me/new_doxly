class ChangeEmailPreferenceToDailyDigest < ActiveRecord::Migration
  def change
    EntityUser.where(email_digest_preference: 'short_burst').each do |entity_user|
      entity_user.email_digest_preference = 'daily_digest'
      entity_user.save!
    end
  end
end
