class SupportMailer < ApplicationMailer
  default :from => Doxly.config.alerts_reply_email

  def sending_packet_failed_email(deal, sending_entity_user, recipient_email, recipient_name, error, is_docusign)
    @deal                = deal
    @sending_entity_user = sending_entity_user
    @entity_name         = @sending_entity_user.entity.name
    @recipient_email     = recipient_email
    @recipient_name      = recipient_name
    @error               = error
    @is_docusign         = is_docusign

    mail to: Doxly.config.alerts_email, cc: Doxly.config.admin_email, subject: "Sending of signatures failed for #{@entity_name}" do |format|
      format.text { render 'app/shared/mailer/support/sending_packet_failed_email' }
      format.html { render 'app/shared/mailer/support/sending_packet_failed_email' }
    end
  end

  def processing_manual_signatures_failed_email(deal, sending_entity_user, file_path, options={})
    @deal                = deal
    @sending_entity_user = sending_entity_user
    @entity_name         = @sending_entity_user.entity.name
    @file_path           = file_path

    @signature_packet     = options.fetch(:signature_packet, nil)
    @unreadable_pages     = options.fetch(:unreadable_pages, [])
    @wrong_packet_pages   = options.fetch(:wrong_packet_pages, [])
    @already_signed_pages = options.fetch(:already_signed_pages, [])

    errors               = options.fetch(:errors, [])
    @error_pages         = errors.collect{ |e| e[:page] }
    @error_messages      = errors.collect{ |e| e[:message] }.uniq

    mail to: Doxly.config.alerts_email, cc: Doxly.config.admin_email, subject: "Manual signatures alert for #{@entity_name}" do |format|
      format.text { render 'app/shared/mailer/support/processing_manual_signatures_failed_email' }
      format.html { render 'app/shared/mailer/support/processing_manual_signatures_failed_email' }
    end
  end

  def conversion_failed_email(version)
    @version      = version
    attachable    = @version.attachment.attachable
    @deal         = attachable.is_a?(Deal) ? attachable : attachable.deal
    @tree_element = attachable unless attachable.is_a?(Deal)
    @response     = @version.conversions.last.response

    mail to: Doxly.config.alerts_email, cc: Doxly.config.admin_email, subject: "Conversion failed for #{@version.file_name}" do |format|
      format.text { render 'app/shared/mailer/support/conversion_failed_email' }
      format.html { render 'app/shared/mailer/support/conversion_failed_email' }
    end
  end

  def packet_retrieval_failed_email(notification)
    @notification        = notification
    @signature_packet    = @notification.signature_packet
    @deal                = @signature_packet.deal
    @recipient_user      = @signature_packet.user
    @sending_entity_user = @signature_packet.sent_by_entity_user
    @entity_name         = @sending_entity_user.entity.name
    @error               = @notification.critical_errors.last&.error_message

    mail to: Doxly.config.alerts_email, cc: Doxly.config.admin_email, subject: "Signature packet retrieval from Docusign failed for #{@recipient_user.name} (#{@entity_name})" do |format|
      format.text { render 'app/shared/mailer/support/packet_retrieval_failed_email' }
      format.html { render 'app/shared/mailer/support/packet_retrieval_failed_email' }
    end
  end

  def send_weekly_feeds(feed_files, options={})
    @start_date = options.fetch(:start_date, nil)
    @end_date   = options.fetch(:end_date, nil)
    @feed_files = feed_files
    recipient   = options.fetch(:recipient, nil)
    cc          = options.fetch(:cc, "")

    @feed_files.each do |feed_file|
      next unless File.exist?(feed_file)
      attachments[File.basename(feed_file)] = File.read(feed_file)
    end
    mail to: recipient, cc: cc, subject: "Doxly User and Deal Feeds" do |format|
      format.text { render 'app/shared/mailer/support/send_weekly_feeds' }
      format.html { render 'app/shared/mailer/support/send_weekly_feeds' }
    end
  end

end
