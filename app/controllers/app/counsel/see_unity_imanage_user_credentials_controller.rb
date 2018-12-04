class App::Counsel::SeeUnityImanageUserCredentialsController < App::ApplicationController

  def create
    check_read(:entity_level_dms_integration)
    see_unity_imanage_user_credential.assign_attributes(see_unity_imanage_user_credential_params)
    if see_unity_imanage_user_credential.set_refresh_token!(current_entity_user)
      see_unity_imanage_user_credential.create_dms_user_credential(entity_user_id: current_entity_user.id) unless see_unity_imanage_user_credential.dms_user_credential
      @alert_type = 'success'
    else
      @alert_type = 'error'
    end
  end

  private

  def see_unity_imanage_user_credential_params
    params.require(:see_unity_imanage_user_credential).permit(:username, :password)
  end

  def see_unity_imanage_user_credential
    @see_unity_imanage_user_credential ||= current_entity_user.dms_user_credentialable || SeeUnityImanageUserCredential.new
  end
end
