class EsignatureNotificationsController < ActionController::Base
  include Controllers::EsignatureNotifications

  def index
    notification = EsignatureNotification.find_by! :token => params[:token] if params[:token].present?
    if notification && !notification.is_processing?
      notification.docusign_posted!

      # start retrieving the completed signatures
      retrieve_from_docusign(notification)
    end
    head :ok
  end

end
