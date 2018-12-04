class App::ZendeskSessionsController < ApplicationController

  def index
    zendesk_url = if current_user && current_user.entities.map(&:is_counsel?).any?
      zendesk_sso_url
    else
      zendesk_login_url
    end
    redirect_to zendesk_url
  end

  def new
    redirect_to zendesk_login_url
  end

  private

  def zendesk_sso_url
    issued_at   = Time.now.to_i
    jwt_id      = "#{issued_at}/#{SecureRandom.hex(18)}"
    jwt_payload = JWT.encode({
      :iat   => issued_at, # Determines when this token expires
      :jti   => jwt_id, # Unique token id
      :name  => current_user.name,
      :email => current_user.email,
    }, Doxly.config.zendesk_secret)

    sso_url = "#{Doxly.config.zendesk_base_url}/access/jwt?jwt=#{jwt_payload}"
    sso_url += "&return_to=#{URI.escape(params[:return_to])}" unless params[:return_to].nil?
    sso_url
  end

  def zendesk_login_url
    "#{Doxly.config.zendesk_base_url}/access/normal/"
  end

end
