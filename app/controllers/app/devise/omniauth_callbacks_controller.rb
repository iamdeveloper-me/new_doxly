class App::Devise::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  include Controllers::SsoSettings

  skip_before_filter :verify_authenticity_token

  # Dynamically set up omniauth based on entity
  def setup
    # get entity setings
    settings = sso_settings
    if settings
      request.env['omniauth.strategy'].options[:issuer_name] = settings.issuer_name
      request.env['omniauth.strategy'].options[:issuer] = settings.issuer
      request.env['omniauth.strategy'].options[:realm] = settings.realm
      request.env['omniauth.strategy'].options[:reply] = settings.reply
      request.env['omniauth.strategy'].options[:saml_version] = settings.saml_version
      request.env['omniauth.strategy'].options[:id_claim] = settings.id_claim
      request.env['omniauth.strategy'].options[:idp_cert] = settings.idp_cert
      render :text => "Omniauth setup phase.", :status => 404
    else
      render :text => "Omniauth setup phase error. Configuration not available for the entity.", :status => 404
    end
  end

  def success
    auth = request.env["omniauth.auth"].slice(:uid)
    uid  = auth&.uid
    if uid
      user = User.find_by(:email => uid)
      if user && user.persisted?
        # confirm the user account if the user is not confirmed
        user.refresh_user_confirmation_token if !user.confirmed?
        # make the user active
        user.activate_user if user.confirmed? && !user.is_active?
        # sign in the user
        flash[:success] = "You have successfully signed in to Doxly using your company credentials"
        sign_in_and_redirect user, :event => :authentication
      else
        redirect_to_failure_path('no_user')
      end
    else
      redirect_to_failure_path('sso_fail')
    end
  end

  def failure
    redirect_to_failure_path('sso_fail')
  end

  private

  def redirect_to_failure_path(error_type)
    redirect_to "/?error=#{error_type}"
  end

end
