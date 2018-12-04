namespace :daily_digest do

  task :process => :environment do

    EntityUser.where(email_digest_preference: "daily_digest").each do |entity_user|
      # check if user gets email depending on their timezone
      users_current_time = DateTime.now.in_time_zone(entity_user.user.time_zone)
      nine_am_today = users_current_time.beginning_of_day + 9.hours
      is_past_nine_am = users_current_time >= nine_am_today
      is_before_ten_am = users_current_time <= (nine_am_today + 59.minutes)
      if is_past_nine_am && is_before_ten_am
        # time period for events
        start_time = DateTime.yesterday.in_time_zone(entity_user.user.time_zone).beginning_of_day + 9.hours
        end_time   = start_time + 24.hours
        # check for events -- we need to convert to UTC as the date/times are stored in UTC in the DB
        start_time_utc   = start_time.utc
        end_time_utc     = end_time.utc
        events_available = false
        deal_entity_users = entity_user.deal_entity_users
        entity_user.all_deals.each do |deal|
          events = deal.events_between(start_time_utc, end_time_utc).select{ |event| entity_user.user.can_see_event?(event, entity_user) } || []
          if events.any?
            events_available = true
            break
          end
        end
        if events_available
          NotificationMailer.notification_email(start_time_utc, end_time_utc, entity_user).deliver_now
        end
      end
    end
  end
end
