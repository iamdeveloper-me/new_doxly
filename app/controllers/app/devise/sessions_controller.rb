class App::Devise::SessionsController < Devise::SessionsController
  layout 'login'
  include Controllers::AuthenticatesWithTwoFactor
  include Controllers::EntitySwitch
  include Controllers::SignInRedirection
  include Controllers::SsoSettings
  include Controllers::TimeZoneable

  prepend_before_filter :set_return_to_path, :only => :new
  prepend_before_filter :set_entity_user_id, :only => :new
  prepend_before_action :authenticate_with_two_factor,
    if: :two_factor_enabled?, only: [:create]

  helper_method :is_browser_supported?

  def create
    # need to override the devise create method because we are handling two factor authentication without using devise
    self.resource = warden.authenticate!(:database_authenticatable)
    set_flash_message!(:notice, :signed_in)
    sign_in(resource_name, resource)
    save_user_timezone(@user)
    respond_with resource, location: after_sign_in_path_for(resource)
  end

  def new
    session.delete(:otp_user_id) if session[:otp_user_id]
    flash.delete(:alert) if (flash[:alert] == unauthenticated_message) && !requested_protected_page?
    # needed due to the double redirection from turbolinks on certain actions
    flash.keep
    respond_to do |format|
      format.js {
        # have to clear this as it will attempt to render the :html version of the :js template
        session[:user_return_to] = nil
        render :js => "App.Helpers.navigateTo('/', true);"
      }
      format.html { super }
    end
  end

  # Redirect to sign_in directly to prevent losing the flash message
  def after_sign_out_path_for(resource_or_scope)
    new_user_session_path
  end

  def destroy
    super do
      cookies.delete(:authentication)
      if using_subdomain? && sso_settings.present?
        # TODO: Once we have a second SSO provider integration, this needs to be updated accordingly
        logout_url = sso_settings.logout_url
        redirect_to ("#{logout_url}https://#{request.host}") and return if logout_url
      end
    end
  end

  private

  def is_browser_supported?
    supported_browser  = Struct.new(:browser, :version)
    supported_browsers = [
      supported_browser.new(Doxly.config.ie_user_agent_name, Doxly.config.min_ie_version.to_s),
      supported_browser.new(Doxly.config.edge_user_agent_name, Doxly.config.min_edge_version.to_s),
      supported_browser.new(Doxly.config.firefox_user_agent_name, Doxly.config.min_firefox_version.to_s),
      supported_browser.new(Doxly.config.chrome_user_agent_name, Doxly.config.min_chrome_version.to_s),
      supported_browser.new(Doxly.config.safari_user_agent_name, Doxly.config.min_safari_version.to_s),
      supported_browser.new(Doxly.config.opera_user_agent_name, Doxly.config.min_opera_version.to_s)
    ]
    supported_browsers.detect{ |browser| current_user_agent >= browser }.present?
  end

  def requested_protected_page?
    [counsel_app_root_path, client_app_root_path].exclude? session[:user_return_to]
  end

  def unauthenticated_message
    I18n.t('devise.failure.unauthenticated')
  end

  def user_params
    params.require(:user).permit(:email, :password, :remember_me, :otp_attempt)
  end

  def find_user
    @user ||= if session[:otp_user_id]
      User.find(session[:otp_user_id])
    elsif user_params[:email]
      User.find_by(email: user_params[:email])
    end
  end

  def two_factor_enabled?
    find_user&.two_factor_enabled?
  end

  def valid_otp_attempt?(user)
    user.validate_and_consume_otp!(user_params[:otp_attempt]) ||
      user.invalidate_otp_backup_code!(user_params[:otp_attempt])
  end

end
