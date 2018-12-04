require 'barby'
require 'barby/barcode/qr_code'
require 'barby/outputter/png_outputter'

class Api::V1::UsersController < Api::V1::ApplicationController

  api!
  def get_current_user
    check_read(:entity_user)
    render_success(run_object_serializer(current_user, UserSerializer))
  end

  api!
  def two_factor_authentication_disable
    check_update(:entity_user)
    if current_user.entities.where(otp_required_for_login: true).count > 0
      render_validation_failed([t('errors.two_factor_authentication.not_allowed_to_disable')])
    end

    if current_user.disable_two_factor_authentication!
      render_success(run_object_serializer(current_user, UserSerializer))
    else
      render_validation_failed([t('errors.two_factor_authentication.unable_to_disable')])
    end
  end

  api!
  def two_factor_authentication_generate_recovery_codes
    check_update(:entity_user)
    recovery_codes = current_user.generate_otp_backup_codes!
    current_user.bypass_password_validation = true
    if current_user.save
      render_success(recovery_codes)
    else
      render_validation_failed([t('errors.two_factor_authentication.unable_to_generate_recovery_codes')])
    end
  end

  api!
  def two_factor_authentication_qr_code
    check_update(:entity_user)
    if current_user.build_two_factor_authentication_secret!
      qr_code = current_user.build_two_factor_authentication_qr_code
      display_file(qr_code.path)
    else
      render_validation_failed([t('errors.two_factor_authentication.an_error_occurred')])
    end
  end

  api!
  def two_factor_authentication_verify_token
    check_update(:entity_user)
    if current_user.validate_and_consume_otp!(params[:token])
      render_success
    else
      render_validation_failed
    end
  end

  api!
  def two_factor_authentication_enable
    check_update(:entity_user)
    if current_entity.sso_available?
      render_validation_failed([t('errors.two_factor_authentication.an_error_occurred')])
    elsif current_user.enable_two_factor_authentication!
      render_success(run_object_serializer(current_user, UserSerializer))
    else
      render_validation_failed([t('errors.two_factor_authentication.an_error_occurred')])
    end
  end

end