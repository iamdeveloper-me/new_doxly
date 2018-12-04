module Controllers::Authorization
  extend ActiveSupport::Concern
  include Devise::Controllers::Helpers
  include ActionController::MimeResponds

  def self.included(base)
    base.before_filter :validate_current_entity_user
    base.helper_method :current_entity
    base.helper_method :current_entity_user
    base.helper_method :multiple_entities_exist?
    base.helper_method :session_entity_user_id
  end

  def validate_current_entity_user
    return if current_entity_user.nil? && current_user.is_active? && current_user.is_enabled?
    render('devise/sessions/disabled', :status => :forbidden, :layout =>'login') and return unless current_entity_user.user.is_active? && current_entity_user.user.is_enabled
  end

  def current_entity_user
    return if !user_signed_in? || current_user.entity_users.empty?
    @current_entity_user ||= current_user.entity_users.find_by(id: session_entity_user_id)
  end

  # Returns the current entity
  def current_entity
    return if current_user.is_enabled? && current_entity_user.nil?
    @current_entity ||= current_entity_user.entity
  end

  def multiple_entities_exist?
    return unless current_user.present?
    @multiple_entities_exist ||= current_user.entity_users.count > 1
  end

  def session_entity_user_id
    session[:entity_user_id] ||= current_user.get_entity_user.id
  end
end
