class App::Counsel::RolesController < App::ApplicationController
  include Controllers::Roles

  def new
    check_create(:role)
    role
  end

  def create
    check_create(:role)
    role.attributes = role_params
    if @role.save
      flash.now[:success] = "Role has been created successfully"
    else
      render 'new'
    end
  end

  def edit
    check_update(:role)
    role
  end

  def update
    check_update(:role)
    if role.update_attributes(role_params)
      flash.now[:success] = "Role has been updated successfully"
    else
      render :edit
    end
  end

  def destroy
    check_delete(:role)
    role
    if role.role_links.empty?
      role.destroy
      flash.now[:success] = "Role has been deleted successfully"
    else
      flash.now[:error] = "Please remove users before deleting"
      render 'shared/blank'
    end
  end

  private

  def deal
    @deal ||= begin
      current_deal = current_entity_user.all_deals.find_by(id: params[:deal_id])
      if current_deal.nil?
        raise FailedPermissionsError.new(current_entity_user, :read, :deal)
      else
        current_deal
      end
    end
  end

  def role
    @role ||= params[:id].blank? ? deal.roles.new : deal.roles.find(params[:id])
  end

  def role_params
    params.require(:role).permit(:name)
  end

end
