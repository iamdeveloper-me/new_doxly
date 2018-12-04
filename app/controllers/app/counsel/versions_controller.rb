class App::Counsel::VersionsController < App::ApplicationController
  include Controllers::Versions

  def sync_thumbnails
    check_read(:dms_integration)
    success = version.sync_thumbnails(current_entity_user)
    unless success
      flash.now[:error] = "Could not refresh thumbnails, check your DMS integration credentials. If the problem persists, contact Doxly support."
      render 'shared/blank' and return
    end
    version.reload
    @signature_page_id = params[:signature_page_id]
    @signing_capacity_id = params[:signing_capacity_id]
    @signature_group_id = params[:signature_group_id]
    flash.now[:success] = "Thumbnails up to date"
  end
end
