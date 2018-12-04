class LoginTokensController < ActionController::Base
  layout 'login'
  include Controllers::SignInRedirection

  def show
    if params[:token].present?
      login_token  = LoginToken.find_by(:token => params[:token], :is_active => true)
      if login_token
        flash.discard
        user = login_token.user
        # confirm the user account if the user is not confirmed
        user.refresh_user_confirmation_token if !user.confirmed?
        # make the user active
        user.activate_user if user.confirmed? && !user.is_active?
        # sign in the user
        sign_in(user)
        redirect_to(URI.decode(params[:return_to]) || '/') and return
      end
    end
    flash.now[:error] = "The login token is invalid"
    render 'invalid_token'
  end

  private

  def refresh_user_confirmation_token(user)
    user.refresh_confirmation_token!
    User.confirm_by_token(user.confirmation_token)
    user.reload
  end

  def activate_user(user)
    user.is_active                  = true
    user.bypass_password_validation = true
    user.save
  end
end
