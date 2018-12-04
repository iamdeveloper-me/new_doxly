class App::EntitySwitchController < App::ApplicationController
  include Controllers::EntitySwitch
  
  def self.controller_path
    "app/shared/entity_switch"
  end

  def index
    check_read(:none)
    @entity_users = entity_users.joins(:entity).order("entities.type")
  end

  def switch
    check_read(:none)
    if switch_entity(entity_user_params[:id])
      flash[:success] = "The organization has been successfully changed"
    else
      flash[:error] = "Unable to switch the organization. Please try again."
    end
    redirect_to deals_path
  end

  private

  def entity_users
    @entity_users ||= current_user.entity_users
  end

  def entity_user_params
    params.require(:entity_user).permit(:id)
  end

end
