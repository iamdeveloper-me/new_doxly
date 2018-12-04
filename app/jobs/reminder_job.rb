class ReminderJob < ApplicationJob
  queue_as :reminder

  def perform(reminder)
    # Do process reminder
    NotificationMailer.to_do_reminder_email(reminder).deliver_later
  end
end
