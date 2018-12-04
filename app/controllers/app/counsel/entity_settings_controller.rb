class App::Counsel::EntitySettingsController < App::ApplicationController
  include Controllers::EntitySettings

  def docusign_settings
    check_read(:esignature)
    esignature_provider
    render 'app/counsel/entity_settings/docusign_settings'
  end

  def docusign_settings_save
    check_update(:esignature)
    esignature_provider.assign_attributes(esignature_provider_params)
    esignature_provider.is_demo = Doxly.config.docusign_is_demo
    esignature_provider.unencrypted_password = true
    # We request and store the API password as part of the model validations
    if esignature_provider.save
      flash[:success] = "The entity Docusign settings have been saved successfully"
      redirect_to docusign_settings_path and return
    end
    respond_to_turboboost('app/counsel/entity_settings/docusign_settings_form', '#docusign-settings-form', {:esignature_provider => esignature_provider})
  end

  def licenses
    check_read(:licenses)
    render 'app/counsel/entity_settings/licenses'
  end

  private

  def esignature_provider
    @esignature_provider ||= (current_entity.esignature_provider || current_entity.build_esignature_provider)
  end

  def esignature_provider_params
    params.require(:esignature_provider).permit(:username, :password)
  end

end
