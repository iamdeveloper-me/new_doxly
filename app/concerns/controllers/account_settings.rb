module Controllers::AccountSettings
  extend ActiveSupport::Concern

  included do
    def self.controller_path
      "app/shared/account_settings"
    end
  end

  def my_profile
    check_read(:account_settings)
  end

  def change_email
    check_read(:account_settings)
  end

  def reconfirm_change_email
    check_update(:account_settings)
    if current_user.pending_reconfirmation?
      current_user.send_reconfirmation_instructions
      flash.now[:success] = "The confirmation email has been sent"
    end
    render :change_email
  end

  def cancel_change_email
    check_update(:account_settings)
    if current_user.pending_reconfirmation?
      current_user.cancel_change_email!
      flash.now[:success] = "The change email request has been cancelled"
    end
    render :change_email
  end

  def change_password
    check_read(:account_settings)
  end

  def two_factor_authentication_settings
    check_read(:account_settings)
  end

  def my_profile_save
    check_update(:account_settings)
    current_entity_user.assign_attributes(entity_user_params)
    current_entity_user.save
    current_user.assign_attributes(settings_params)
    current_user.bypass_password_validation = true

    if current_user.save
      flash[:success] = "The account settings have been saved successfully"
      redirect_to(my_profile_path)
    elsif settings_params[:avatar].present?
      current_user.errors.messages[:avatar] = ["must be one of the allowed types: jpg, jpeg, gif, png"]
      render :my_profile
    else
      respond_to_turboboost('my_profile_form', '#account-settings-form')
    end
  end

  def change_email_save
    check_update(:account_settings)
    if current_entity.sso_available?
      flash[:error] = "Your account has single sign-on enabled and is managed outside of Doxly. Please contact your IT administrator for help."
      redirect_to app_root_path
    else
      password = params[:user][:password]
      if current_user.valid_password?(password)
        current_user.assign_attributes(email_params)
        current_user.bypass_password_validation = true
        current_user.bypass_change_email_validation = true
        if current_user.save
          flash[:success] = "The new email address has been successfully saved. Please confirm your email."
          redirect_to change_email_path
        else
          current_user.reload
          respond_to_turboboost('change_email_form', '#change-email-form')
        end
      else
        current_user.errors.add(:current_password, "is not valid")
        respond_to_turboboost('change_email_form', '#change-email-form')
      end
    end
  end

  def change_password_save
    check_update(:account_settings)
    if current_entity.sso_available?
      flash[:error] = "Your account has single sign-on enabled and is managed outside of Doxly. Please contact your IT administrator for help."
      redirect_to app_root_path
    else
      password = params[:user][:current_password]
      if current_user.valid_password?(password)
        current_user.assign_attributes(password_params)
        if current_user.save
          sign_in(current_user, :bypass => true)
          flash[:success] = "The password has been successfully updated"
          redirect_to change_password_path and return
        else
          current_user.errors.add(:password_confirmation, "is not valid")
        end
      else
        current_user.errors.add(:current_password, "is not valid")
      end
      respond_to_turboboost('change_password_form', '#change-password-form')
    end
  end

  private

  def entity_params
    params.require(:entity).permit(:name)
  end

  def entity_user_params
    params.require(:entity_user).permit(:email_digest_preference, :title)
  end

  def settings_params
    params.require(:user).permit(:first_name, :last_name, :phone, :fax, :address, :city, :state, :zip, :avatar, :avatar_cache, :remove_avatar, :role)
  end

  def email_params
    params.require(:user).permit(:email)
  end

  def password_params
    params.require(:user).permit(:password, :password_confirmation)
  end

end
