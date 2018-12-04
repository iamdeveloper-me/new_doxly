class App::Counsel::AccountSettingsController < App::ApplicationController
  include Controllers::AccountSettings

  def integrations
    check_create(:entity_level_dms_integration)
  end
end
