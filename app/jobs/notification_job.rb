class NotificationJob < ApplicationJob
  queue_as :notification

  def perform(start_time, end_time, entity_user)
    NotificationMailer.notification_email(start_time, end_time, entity_user).deliver_later
  end
end
