class ApplicationController < ActionController::Base
  include Controllers::Errors
  include Controllers::FileSender
  include Controllers::UserAgent
  include Controllers::SsoSettings

  protect_from_forgery

  rescue_from Exception do |exception|
    Rails.logger.error exception
    report_to_rollbar exception
    render_internal_server_error
  end unless Rails.env.development?

  rescue_from ActiveRecord::RecordNotFound do |exception|
    Rails.logger.error exception
    report_to_rollbar exception
    render_not_found
  end unless Rails.env.development?

  before_action :authenticate_user!

end
