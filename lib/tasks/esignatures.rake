namespace :esignatures do

  task :process => :environment do
    include Controllers::EsignatureNotifications

    # collect any notifications that are not currently in process and have been in the 'signed' status for over 5 mins. We can then assume that we haven't heard from DS.
    notifications = EsignatureNotification.where("is_processing IS FALSE AND status = 'signed' AND updated_at + (5 ||' minutes')::interval < CURRENT_TIMESTAMP")


    notifications.each do |notification|
      retrieve_from_docusign(notification)
    end
  end

end
