class AddOtpRequiredForLoginToEntities < ActiveRecord::Migration
  def change
    add_column :entities, :otp_required_for_login, :boolean, default: false
  end
end
