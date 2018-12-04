# == AuthenticatesWithTwoFactor
#
# Controller concern to handle two-factor authentication
#
# Upon inclusion, skips `require_no_authentication` on `:create`.
module Controllers::AuthenticatesWithTwoFactor
  extend ActiveSupport::Concern

  included do
    # This action comes from DeviseController, but because we call `sign_in`
    # manually, not skipping this action would cause a "You are already signed
    # in." error message to be shown upon successful login.
    skip_before_action :require_no_authentication, only: [:create], raise: false
  end

  # Store the user's ID in the session for later retrieval and render the
  # two factor code prompt
  #
  # The user must have been authenticated with a valid login and password
  # before calling this method!
  #
  # user - User record
  #
  # Returns nil
  def prompt_for_two_factor(user)
    # Set @user for Devise views
    @user = user

    return locked_user_redirect(user) if user.access_locked?

    session[:otp_user_id] = user.id
    # session[:remember_me] = user_params[:remember_me] || '0'
    render 'app/devise/sessions/two_factor'
  end

  def authenticate_with_two_factor
    user = self.resource = find_user
    return locked_user_redirect(user) if user.access_locked?

    if (user_params[:otp_attempt].present? || params[:from_otp_page]) && session[:otp_user_id]
      authenticate_with_two_factor_via_otp(user)
    elsif user && user.valid_password?(user_params[:password])
      prompt_for_two_factor(user)
    end
  end
  
  private

  def authenticate_with_two_factor_via_otp(user)
    if valid_otp_attempt?(user)
      # Remove any lingering user data from login
      session.delete(:otp_user_id)
      
      # TODO: Figure out how the remember me functionality should work with 2FA. For the time being, it is just not possible to do both
      # if session[:remember_me]
      #   user.bypass_password_validation = true
      #   user.remember_me! if session[:remember_me]
      #   User.serialize_into_cookie(user)
      #   session.delete(:remember_me)
      # end

      sign_in(user)
    else
      user.increment_failed_attempts!
      flash.now[:error] = 'Invalid two-factor authentication code.'
      prompt_for_two_factor(user)
    end
  end

  def locked_user_redirect(user)
    flash.now[:error] = I18n.t('devise.failure.locked')
    render 'app/devise/sessions/new'
  end
end