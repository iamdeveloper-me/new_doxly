class App::Devise::PasswordsController < Devise::PasswordsController
  layout 'login'
  include Controllers::SignInRedirection

  def create
    user = User.find_by(email: params[:user][:email])
    if user && user.entities.any?
      if user.sso_enabled_entity.present?
        InvitationMailer.sso_user_password_reset_email(user).deliver_later
      else
        if user.is_active?
          resource_class.send_reset_password_instructions(resource_params)
        elsif user.present?
          user.refresh_confirmation_token!
          InvitationMailer.unconfirmed_user_password_reset_email(user).deliver_later
        end
      end
    end
    flash[:success] = "If your email address exists in our database, you will receive a password recovery link at your email address in a few minutes."
    respond_with({}, location: after_sending_reset_password_instructions_path_for(resource_name))
  end

end
