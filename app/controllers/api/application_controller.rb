class Api::ApplicationController < ActionController::Base
  include Controllers::Permissable
  include Controllers::Errors
  include Controllers::FileSender

  before_action :set_locale

  acts_as_token_authentication_handler_for User
  after_filter :set_authentication_token_in_headers

  rescue_from Exception do |exception|
    Rails.logger.error exception
    report_to_rollbar exception
    render_failure(400)
  end unless Doxly.config.api_debug_mode

  rescue_from ActiveRecord::RecordNotFound do |exception|
    Rails.logger.error exception
    report_to_rollbar exception
    render_failure(404, [t('errors.not_found')])
  end unless Doxly.config.api_debug_mode

  rescue_from FailedPermissionsError do |exception|
    Rails.logger.error exception
    report_to_rollbar exception
    render_unauthorized
  end unless Doxly.config.api_debug_mode

  def current_user
    @current_user ||= User.find_by(email: params[:user_email], authentication_token: params[:user_token])
  end

  protected

  def render_success(serialized_data = {}, errors = nil, success = nil)
    json = {
      date: Time.now.utc,
      status: 200,
      messages: {errors: errors, success: success},
      data: serialized_data
    }
    render json: json
  end

  def render_validation_failed(errors = nil)
    json = {
      date: Time.now.utc,
      status: 400,
      messages: {errors: errors}
    }
    render json: json
  end

  def render_unauthorized(errors = [t('errors.forbidden')])
    json = {
      date: Time.now.utc,
      status: 401,
      messages: {errors: errors}
    }
    render json: json
  end

  def render_failure(status, errors = ['Something went wrong'])
    json = {
      date: Time.now.utc,
      status: status,
      messages: {errors: errors}
    }
    render json: json
  end

  def run_object_serializer(object, each_serializer, deal = nil)
    ActiveModelSerializers::SerializableResource.new(
      object,
      {
        serializer: each_serializer,
        include: (params[:expand] || ''),
        scope: {current_entity: current_entity, current_entity_user: current_entity_user, deal: deal}
      }
    )
  end

  def run_array_serializer(relation, each_serializer, deal = nil)
    ActiveModelSerializers::SerializableResource.new(
      relation,
      {
        each_serializer: each_serializer,
        include: (params[:expand] || ''),
        scope: {current_entity: current_entity, deal: deal}
      }
    )
  end

  def run_tree_serializer(object, deal_entity_user, all_tree_element_restrictions)
    object.subtree.arrange_serializable do |parent, children|
      ActiveModelSerializers::SerializableResource.new(
        parent,
        {
          include: (params[:expand] || ''),
          scope: {
            children: children.sort_by{ |serializer| serializer.send(:resource)[:position] },
            current_entity: current_entity,
            current_deal_entity_user_id: deal_entity_user.id,
            current_deal_entity_user_class: deal_entity_user.class.name,
            all_tree_element_restrictions: all_tree_element_restrictions,
            category: object
          }
        }
      )
    end
  end

  def set_authentication_token_in_headers
    response.headers['Auth-Token'] = current_user.authentication_token
  end

  def set_locale
    I18n.locale = request.headers['Accept-Language']&.scan(/^[a-z]{2}/)&.first&.to_sym || I18n.default_locale
  end

  def self.api!
    super if Rails.env.development?
  end

end
