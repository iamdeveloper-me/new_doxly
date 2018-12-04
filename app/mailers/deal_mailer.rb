class DealMailer < ApplicationMailer
  def deal_invitation_email(entity_user, deal, custom_message)
    @custom_message = custom_message.present? ? get_formatted_message(custom_message) : nil
    @deal_entity    = deal.deal_entities.first.entity.name
    @user           = entity_user.user
    entity          = entity_user.entity
    @email          = @user.email
    @deal           = deal
    @user_type      = entity == @deal.owner_entity ? 'Team Member' : 'Collaborator'
    @url            = @user.is_active? ? new_user_session_url(:return_to => deal_roles_url(@deal), :entity_user_id => entity_user.id.to_s) : register_url(:token => @user.confirmation_token, :return_to => deal_roles_path(@deal))
    @url            = @url.gsub('/app.', "/#{entity.subdomain}.") if entity.sso_available?
    mail to: @email, subject: "You've Been Added as a #{@user_type}" do |format|
      format.text { render 'app/shared/mailer/deal_invitation_email' }
      format.html { render 'app/shared/mailer/deal_invitation_email' }
    end
  end

  def remind_signer_email(user, current_entity_user, deal, custom_message)
    @custom_message = custom_message.present? ? get_formatted_message(custom_message) : nil
    @reminding_user = current_entity_user.user
    @user           = user
    @email          = @user.email
    @deal           = deal
    @owner_entity   = @deal.owner_entity
    login_token     = @user.login_tokens.find_or_create_by :is_active => true, :deal_id => @deal.id
    @url            = login_tokens_url(:token => login_token.token, :return_to => deal_signature_packets_signature_packets_path(deal_id: @deal.id))
    mail to: @email, subject: "REMINDER: #{@owner_entity.name} Needs Your Signature To Complete The Deal, #{@deal.title}" do |format|
      format.text { render 'app/shared/mailer/remind_signer_email' }
      format.html { render 'app/shared/mailer/remind_signer_email' }
    end
  end

  def signature_packet_notification_email(signature_packet)
    @custom_message = get_formatted_message(signature_packet.message)
    @deal           = signature_packet.deal
    @user           = signature_packet.user
    @email          = @user.email
    @owner_entity   = @deal.owner_entity
    login_token     = @user.login_tokens.find_or_create_by :is_active => true, :deal_id => @deal.id
    @url            = login_tokens_url(:token => login_token.token, :return_to => deal_signature_packets_signature_packets_path(deal_id: @deal.id))
    mail to: @email, subject: "#{@deal.title}: Signature Request" do |format|
      format.text { render 'app/shared/mailer/signature_packet_notification_email' }
      format.html { render 'app/shared/mailer/signature_packet_notification_email' }
    end
  end

  def additional_signature_pages_email(signature_packet)
    @custom_message = get_formatted_message(signature_packet.message)
    @deal           = signature_packet.deal
    @user           = signature_packet.user
    @email          = @user.email
    @owner_entity   = @deal.owner_entity
    login_token     = @user.login_tokens.find_or_create_by :is_active => true, :deal_id => @deal.id
    @url            = login_tokens_url(:token => login_token.token, :return_to => deal_signature_packets_signature_packets_path(deal_id: @deal.id))
    mail to: @user.email, subject: "#{@deal.title}: Additional Signature Request" do |format|
      format.text { render 'app/shared/mailer/additional_signature_pages_email' }
      format.html { render 'app/shared/mailer/additional_signature_pages_email' }
    end
  end

  def signature_packet_notification_email_copy(signature_packet)
    @custom_message = get_formatted_message(signature_packet.message)
    @deal           = signature_packet.deal
    @user           = signature_packet.user
    @name           = signature_packet.signing_capacities.first.name
    @email          = @user.email
    @owner_entity   = @deal.owner_entity
    login_token     = @user.login_tokens.find_or_create_by :is_active => true, :deal_id => @deal.id
    @url            = login_tokens_url(:token => login_token.token, :return_to => deal_signature_packets_signature_packets_path(deal_id: @deal.id))
    @copy_to        = signature_packet.copy_to
    mail to: @copy_to, subject: "#{@deal.title}: Signature Request" do |format|
      format.text { render 'app/shared/mailer/signature_packet_notification_email_copy' }
      format.html { render 'app/shared/mailer/signature_packet_notification_email_copy' }
    end
  end

  def additional_signature_pages_email_copy(signature_packet)
    @custom_message = get_formatted_message(signature_packet.message)
    @deal           = signature_packet.deal
    @user           = signature_packet.user
    @name           = signature_packet.signing_capacities.first.name
    @email          = @user.email
    @owner_entity   = @deal.owner_entity
    login_token     = @user.login_tokens.find_or_create_by :is_active => true, :deal_id => @deal.id
    @url            = login_tokens_url(:token => login_token.token, :return_to => deal_signature_packets_signature_packets_path(deal_id: @deal.id))
    @copy_to        = signature_packet.copy_to
    mail to: @copy_to, subject: "#{@deal.title}: Additional Signature Request" do |format|
      format.text { render 'app/shared/mailer/additional_signature_pages_email_copy' }
      format.html { render 'app/shared/mailer/additional_signature_pages_email_copy' }
    end
  end

  def signature_packet_failed_to_send_email(additional_pages, method_text, recipient_name, copy_to, sender, message, document_objects, attached_for_review_only, email)
    @additional_pages         = additional_pages
    @method_text              = method_text
    @recipient_name           = recipient_name
    @copy_to                  = copy_to
    @sender                   = sender
    @message                  = message
    @document_objects         = document_objects
    @email                    = email
    @attached_for_review_only = attached_for_review_only
    mail to: @email, subject: "Signature Packet Failed: #{@recipient_name}, #{@method_text}" do |format|
      format.text { render 'app/shared/mailer/signature_packet_failed_to_send_email' }
      format.html { render 'app/shared/mailer/signature_packet_failed_to_send_email' }
    end
  end

  def received_signatures_email(signature_packet)
    @deal         = signature_packet.deal
    @user         = signature_packet.user
    @name         = signature_packet.signing_capacities.first.name
    @owner_entity = @deal.owner_entity
    mail to: @user.email, subject: "#{@deal.title}: Signatures Received" do |format|
      format.text { render 'app/shared/mailer/received_signatures_email'}
      format.html { render 'app/shared/mailer/received_signatures_email'}
    end
  end

  def received_signature_packet_email(signature_packet)
    @deal          = signature_packet.deal
    @entity_user   = signature_packet.sent_by_entity_user
    @user          = @entity_user.user
    @name          = signature_packet.signing_capacities.first.name
    @url           = new_user_session_url(:return_to => deal_signature_packets_url(@deal), :entity_user_id => @entity_user.id.to_s)
    mail to: @user.email, subject: "#{@deal.title}: #{@name} submitted a Signature Packet" do |format|
      format.text { render 'app/shared/mailer/received_signature_packet_email'}
      format.html { render 'app/shared/mailer/received_signature_packet_email'}
    end
  end

  def received_signature_packet_email_copy(signature_packet)
    @deal          = signature_packet.deal
    @name          = signature_packet.signing_capacities.first.name
    @copy_to       = signature_packet.copy_to
    mail to: @copy_to, subject: "#{@deal.title}: #{@name} submitted a Signature Packet" do |format|
      format.text { render 'app/shared/mailer/received_signature_packet_email_copy'}
      format.html { render 'app/shared/mailer/received_signature_packet_email_copy'}
    end
  end

  def threshold_met_email(user, document)
    @document = document
    @deal = @document.deal
    mail to: user.email, subject: "Voting Threshold Met on #{@document.name}" do |format|
      format.text { render 'app/shared/mailer/threshold_met_email'}
      format.html { render 'app/shared/mailer/threshold_met_email'}
    end
  end

  private

  def get_page_numbers(page_numbers)
    grouped_numbers   = page_numbers.slice_when { |previous, current| current != previous.next }.to_a
    page_number_groups_array = grouped_numbers.map{ |group| (group.size > 1) ?  "#{group.first}-#{group.last}" : group.first }
    "#{page_numbers.length == 1 ? 'Page' : 'Pages'} #{page_number_groups_array.join(', ')}"
  end

  def get_formatted_message(message)
    message.gsub(/\n/, '<br />').html_safe
  end
end
