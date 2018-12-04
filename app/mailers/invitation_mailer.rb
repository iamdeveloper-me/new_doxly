class InvitationMailer < ApplicationMailer
  def entity_user_invitation_email(user, entity, current_entity_user)
    @email        = user.email
    @entity       = entity
    @invitee_name = current_entity_user.name
    entity_name   = @entity.is_a?(Individual) ? "" : "#{@entity.name} on "
    @url          = register_url(:token => user.confirmation_token)
    @url          = @url.gsub('/app.', "/#{@entity.subdomain}.") if @entity.sso_available?
    mail to: @email, subject: "You've Been Invited to Join #{entity_name}Doxly by #{@invitee_name}" do |format|
      format.text { render 'app/shared/mailer/entity_user_invitation_email' }
      format.html { render 'app/shared/mailer/entity_user_invitation_email' }
    end
  end

  def entity_invitation_email(user, entity)
    @email      = user.email
    @entity     = entity
    @url        = register_url(:token => user.confirmation_token)
    @url        = @url.gsub('/app.', "/#{@entity.subdomain}.") if @entity.sso_available?
    entity_name = @entity.is_a?(Individual) ? "" : "#{@entity.name} on "
    mail to: @email, subject: "You've Been Invited to Join #{entity_name}Doxly" do |format|
      format.text { render 'app/shared/mailer/entity_invitation_email' }
      format.html { render 'app/shared/mailer/entity_invitation_email' }
    end
  end

  def confirmation_expired_resend_invitation_email(user)
    @user   = user
    @email  = user.email
    @entity = user.entities.first
    @url    = register_url(:token => user.confirmation_token)
    @url    = @url.gsub('/app.', "/#{@entity.subdomain}.") if @entity.sso_available?
    mail to: @email, subject: "Your New Invitation Email for #{@entity.name} on Doxly" do |format|
      format.text { render 'app/shared/mailer/confirmation_expired_resend_invitation_email' }
      format.html { render 'app/shared/mailer/confirmation_expired_resend_invitation_email' }
    end
  end

  def unconfirmed_user_password_reset_email(user)
    @user   = user
    @email  = user.email
    @entity = user.entities.first
    @url    = register_url(:token => user.confirmation_token)
    mail to: @email, subject: "Your Password Reset Link for #{@entity.name} on Doxly" do |format|
      format.text { render 'app/shared/mailer/unconfirmed_user_password_reset_email' }
      format.html { render 'app/shared/mailer/unconfirmed_user_password_reset_email' }
    end
  end

  def entity_connection_invitation_email(entity_connection)
    @inviting_entity  = entity_connection.my_entity
    @recipient_entity = entity_connection.connected_entity
    @emails           = @recipient_entity.entity_users.map{|entity_user| entity_user.user.email}
    @url              = confirm_entity_connection_entity_connections_url(confirmation_token: entity_connection.confirmation_token)
    @url              = @url.gsub('/app.', "/#{@recipient_entity.subdomain}.") if @recipient_entity.sso_available?
    mail to: @emails, subject: "#{@inviting_entity.name} Would Like to Connect with #{@recipient_entity.name} on Doxly" do |format|
      format.text { render 'app/shared/mailer/entity_connection_invitation_email' }
      format.html { render 'app/shared/mailer/entity_connection_invitation_email' }
    end
  end

  def sso_user_password_reset_email(user)
    @user   = user
    @email  = user.email
    @entity = user.sso_enabled_entity
    @url    = root_url.gsub('/app.', "/#{@entity.subdomain}.")
    mail to: @email, subject: "Your Password Reset Request for #{@entity.name} on Doxly" do |format|
      format.text { render 'app/shared/mailer/sso_user_password_reset_email' }
      format.html { render 'app/shared/mailer/sso_user_password_reset_email' }
    end
  end

end
