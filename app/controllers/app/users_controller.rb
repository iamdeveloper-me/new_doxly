class App::UsersController < App::ApplicationController

  def show_avatar
    check_read(:entity_user)
    user = User.find_by id: params[:id]
    if user
      send_attachment(user.avatar)
    else
      head :ok
    end
  end

end
