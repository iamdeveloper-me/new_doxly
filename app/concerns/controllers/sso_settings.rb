module Controllers::SsoSettings

  def self.included(base)
    base.helper_method :using_subdomain?, :sso_entity, :sso_settings
  end

  def using_subdomain?
    if Rails.env.development?
      !Doxly.config.non_sso_subdomains.include?(subdomain)
    else
      subdomain != "app"
    end
  end

  def sso_entity
    @sso_entity ||= begin
      Entity.find_by(subdomain: subdomain)
    end
  end

  # TODO: Used 'first' here for now as we only have 1 SSO provider. Once we add more, this can be removed to account the login and logout of currently selected SSO
  def sso_settings
    active_sso_provider_configurations.first&.sso_provider_configurationable
  end

  private

  def active_sso_provider_configurations
    @active_sso_provider_configurations ||= Array(sso_entity&.sso_provider_configurations&.active)
  end

  def subdomain
    @subdomain ||= request.subdomains.first
  end

end
