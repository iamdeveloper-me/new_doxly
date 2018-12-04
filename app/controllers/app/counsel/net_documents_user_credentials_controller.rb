class App::Counsel::NetDocumentsUserCredentialsController < App::ApplicationController

  def authorize
    check_read(:none)
    if net_documents_user_credential.set_refresh_token!(current_entity_user, params[:code])
      net_documents_user_credential.create_dms_user_credential(entity_user_id: current_entity_user.id) unless net_documents_user_credential.dms_user_credential
      @alert_type = 'success'
    else
      @alert_type = 'error'
    end
    current_entity_user.reload
    render 'shared/account_settings/integrations'
  end

  private

  def net_documents_user_credential
    @net_documents_user_credential ||= current_entity_user.dms_user_credentialable || NetDocumentsUserCredential.new
  end
end
