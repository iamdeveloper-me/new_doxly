class App::Counsel::Imanage10UserCredentialsController < App::ApplicationController

  def create
    check_read(:entity_level_dms_integration)
    imanage10_user_credential.assign_attributes(imanage10_user_credential_params)
    if imanage10_user_credential.set_access_token!(current_entity_user)
      imanage10_user_credential.create_dms_user_credential(entity_user_id: current_entity_user.id) unless imanage10_user_credential.dms_user_credential
      @alert_type = 'success'
    else
      @alert_type = 'error'
    end
  end

  private

  def imanage10_user_credential_params
    params.require(:imanage10_user_credential).permit(:username, :password)
  end

  def imanage10_user_credential
    @imanage10_user_credential ||= current_entity_user.dms_user_credentialable || Imanage10UserCredential.new
  end
end
