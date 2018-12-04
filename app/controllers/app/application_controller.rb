class App::ApplicationController < ApplicationController
  include Controllers::Authorization
  include Controllers::Permissable

  rescue_from FailedPermissionsError, with: :forbidden_request
  prepend_before_filter :prepend_view_paths

  before_action :get_starred_deals, if: "current_user"

  helper_method :current_path, :app_root_path, :current_context_css_class, :signing_workflow_class, :on_deals_tab

  before_action :set_time_zone
  before_action :verify_two_factor_authentication_requirement
  before_action :configure_permitted_parameters, if: :devise_controller?
  before_action :verify_authentication_cookie

  def get_starred_deals
    @starred_deals ||= current_entity_user.starred_deals.reload if current_entity_user
  end

  def forbidden_request(exception = nil)
    case exception
    when FailedPermissionsError
      Rails.logger.info "Forbidden request: EntityUser(#{exception.entity_user.try(:id)}) cannot access key (#{exception.key.inspect}) permission (#{exception.permission.inspect})"
    end
    render_unauthorized
  end

  def respond_to_path(path)
    respond_to do |format|
      format.js {
        flash.keep
        render :js => "App.Helpers.navigateTo('#{path}', true);"
      }
      format.html { redirect_to path }
    end
  end

  def respond_to_turboboost(partial, selector, locals={})
    render partial: partial, within: selector, locals: locals
  end

  def current_path
    request.env['PATH_INFO']
  end

  def app_root_path
    if current_user.entities.empty?
      signer_app_root_path
    else
      current_entity.is_counsel? ? counsel_app_root_path : client_app_root_path
    end
  end

  def current_context_css_class
    if current_user.entities.empty?
      'signer-view'
    elsif !current_entity.is_counsel?
      'party-view'
    end
  end

  def signing_workflow_class
    'signing-portal' if params[:controller].include?('app/signer')
  end

  def set_session_entity_user_id(entity_user_id)
    session[:entity_user_id] = entity_user_id
  end

  def on_deals_tab
    /\A\/deals.*\z/.match(request.fullpath).present? || (current_user.entity_users.any? && request.fullpath == '/')
  end

  protected

  # Sets the scope for the view paths
  def prepend_view_paths
    return unless current_user.present?
    if current_user.entities.empty?
      role_view_path = 'signer'
    else
      role_view_path = current_entity.is_counsel? ? 'counsel' : 'client'
    end
    prepend_view_path ['app/views/app', "app/views/app/#{role_view_path}"]
  end

  private

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_in, keys: [:otp_attempt])
  end

  def set_time_zone
    if Rails.env.test?
      Time.zone = Rails.application.config.time_zone
    else
      if !cookies[:timezone] && !request.xhr? && request.get?
        redirect_to time_zone_path(:redirect => "#{request.protocol}#{request.host_with_port}#{request.fullpath}")
      else
        Time.zone = cookies[:timezone] ? ActiveSupport::TimeZone.new(cookies[:timezone]) : Rails.application.config.time_zone
      end
    end
  end

  def verify_two_factor_authentication_requirement
    if params[:action] != 'two_factor_authentication_settings' && !current_user&.two_factor_enabled? && current_user.entities.where(otp_required_for_login: true).count > 0
      redirect_to two_factor_authentication_settings_path(required: true)
    end
  end

  def verify_authentication_cookie
    if current_user.present? && current_user.entities.any? && !cookies[:authentication].present?
      current_user.create_authentication_cookie(cookies, current_entity_user.id)
    end
  end

end
