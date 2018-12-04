class App::Devise::ConfirmationsController < Devise::ConfirmationsController
  layout 'login'

  def show
    if current_user.nil? || (current_user.confirmation_token != params[:confirmation_token])
      flash[:error] = if current_user.nil? 
        "You have to be logged in to confirm your new email. Please login and click on the link again."
      else
        "Invalid confirmation token"
      end
      redirect_to root_path
    else
      super
    end
  end
end
