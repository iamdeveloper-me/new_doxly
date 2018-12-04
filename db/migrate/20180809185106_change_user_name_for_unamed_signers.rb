class ChangeUserNameForUnamedSigners < ActiveRecord::Migration
  def change
    User.all.where(first_name: 'Unnamed', last_name: 'Signer').each do |user|
      user.first_name = User::FIRST_NAME_PLACEHOLDER
      user.last_name  = User::LAST_NAME_PLACEHOLDER
      user.bypass_password_validation = true
      user.bypass_email_validation = true
      user.skip_confirmation_notification!
      user.save!
    end
  end
end
