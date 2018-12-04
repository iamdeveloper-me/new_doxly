class RegistrationController < ActionController::Base
  layout 'login'
  include Controllers::SignInRedirection
  include Controllers::TimeZoneable
  include Controllers::UserAgent

  def edit
    return return_invalid_token if (!user.present? || params[:token] != user.confirmation_token)
    set_return_to_path
    redirect_to '/sign_in' and return if user.is_active
  end

  def update
    return return_invalid_token unless user.present?
    if user.is_active
      redirect_to '/sign_in'
      return
    end
    # check to make sure that the user will save and can be confirmed.
    user.assign_attributes(user_params)
    is_valid = user.valid?
    if is_valid
      user = User.confirm_by_token(params[:token])
      user.assign_attributes(user_params) # have to re-assign_attributes because new user object in memory.
      return return_token_expired unless user.confirmed?
      user.is_active = true
      if user.entities.any?
        entity            = user.entities.first
        entity.name       = params[:entity][:name] if entity.users.count == 1 && params[:entity].present?
        entity_user       = user.entity_users.first
        entity_user.title = (params[:entity_user].present? && params[:entity_user][:title].present?) ? params[:entity_user][:title] : "Individual"
      end
      user.save
      user.reload
      sign_in(user)
      save_user_timezone(user)
      @user = user
      redirect_to session[:user_return_to] || '/'
      return
    end
    @user = user
    render :edit
  end

  private

  def return_invalid_token
    flash[:error] = "The registration token is invalid"
    redirect_to '/sign_in'
  end

  def user
   @user ||= User.find_by(:confirmation_token => params[:token]) if params[:token].present?
  end

  def user_params
    params.require(:user).permit(:first_name, :last_name, :password, :password_confirmation)
  end

  def return_token_expired
    flash[:error] = "Invitation email is expired. Check your inbox for a new invitation email."
    user.refresh_confirmation_token!
    InvitationMailer.confirmation_expired_resend_invitation_email(user).deliver_later
    redirect_to '/sign_in'
  end

end
