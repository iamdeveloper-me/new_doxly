class NotificationMailer < ApplicationMailer
  def to_do_assigned_email(to_do)
    # variables
    user               = to_do.deal_entity_user.entity_user.user
    email              = user.email
    due_date           = to_do.due_dates.first.value.strftime("%B %d, %Y") if to_do.due_dates.first
    tree_element       = to_do.tree_element
    deal               = tree_element.deal

    # put it all together
    @url      = deal_category_url(deal, tree_element.root)
    @subject  = "You've been assigned a To-do"
    @headline = "You've been assigned a to-do \"#{to_do.text}\" on \"#{tree_element.name}\" in the deal, #{deal.title}."
    @headline += " It is due on #{due_date}." if due_date

    # send email
    mail to: email, subject: @subject do |format|
      format.text { render 'app/shared/mailer/to_do_email' }
      format.html { render 'app/shared/mailer/to_do_email' }
    end
  end

  def to_do_reminder_email(reminder)
    # variables
    user               = reminder.entity_user.user
    email              = user.email
    to_do_text         = reminder.due_date.due_dateable.try(:text)
    due_date           = reminder.due_date.value.strftime("%B %d, %Y")
    tree_element       = reminder.due_date.due_dateable.tree_element
    deal               = tree_element.deal

    # put it all together
    @url      = deal_category_url(deal, tree_element.root)
    @subject  = "To-do due on #{due_date}"
    @headline = "To-do \"#{to_do_text}\" on \"#{tree_element.name}\" in the deal, #{deal.title}, is due on #{due_date}."

    # send email
    mail to: email, subject: @subject do |format|
      format.text { render 'app/shared/mailer/to_do_email' }
      format.html { render 'app/shared/mailer/to_do_email' }
    end
  end

  def notification_email(start_time, end_time, entity_user)
    @deals = entity_user.all_deals
    @user = entity_user.user
    @email = @user.email
    @subject = "Doxly Daily Digest"
    @subtitle = "The following actions have taken place within the last 24 hours."
    @start_time = start_time
    @end_time = end_time
    @entity_user = entity_user

    # send email
    mail to: @email, subject: @subject do |format|
      format.text { render 'app/shared/mailer/notification_email' }
      format.html { render 'app/shared/mailer/notification_email' }
    end
  end
end
