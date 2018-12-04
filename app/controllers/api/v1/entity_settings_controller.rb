class Api::V1::EntitySettingsController < Api::V1::ApplicationController
  include Controllers::Api::EntitySettings

  api!
  def docusign_settings
    check_read(:esignature)
    render_success(esignature_provider)
  end
  
  api!
  def docusign_settings_save
    check_update(:esignature)
    esignature_provider.assign_attributes(esignature_provider_params)
    esignature_provider.is_demo = Doxly.config.docusign_is_demo
    esignature_provider.unencrypted_password = true
    # We request and store the API password as part of the model validations
    if esignature_provider.save
      render_success(esignature_provider)
    else
      render_validation_failed(esignature_provider.errors.full_messages)
    end
  end

  api!
  def licenses
    render_success({"success": check_read(:licenses)})
  end

  private

  def esignature_provider
    esignature_provider ||= (current_entity.esignature_provider || current_entity.build_esignature_provider)
  end

  def esignature_provider_params
    params.require(:esignature_provider).permit(:username, :password)
  end

end
