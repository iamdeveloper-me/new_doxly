class Api::V1::DmsFilePicker::ApplicationController < Api::V1::ApplicationController

  rescue_from Exception do |exception|
    user_credential = current_entity_user&.dms_user_credentialable
    user_credential.create_critical_error(:dms_api_error, exception: exception, user_message: t('errors.dms_api_error')) if user_credential
    Rails.logger.error exception
    report_to_rollbar exception
    render_failure(400, [t('errors.dms_api_error')])
  end unless Doxly.config.api_debug_mode

  rescue_from DmsApiTokenExpiredError do |exception|
    Rails.logger.error exception
    report_to_rollbar exception
    render_unauthorized([exception.message])
  end unless Doxly.config.api_debug_mode

end
