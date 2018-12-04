class App::Counsel::DealIndividualUsersController < App::ApplicationController
  include Controllers::EntityConnections
  include Controllers::DealEmails

  def new
    check_create(:entity_connection)
    @role = deal.roles.find_by(id: params[:role_id])
    @deal_entity = deal.deal_entities.new
    @deal_entity_user = @deal_entity.deal_entity_users.new
    @entity_user = @deal_entity_user.build_entity_user
    @user = @entity_user.build_user
  end

  def create
    check_create(:entity_connection)
    @role = deal.roles.find_by(id: params[:role_id])
    @user = User.find_by(email: params[:user][:email]&.downcase)
    success = run_creation_transaction
    check_success_and_render(success)
  end

  def destroy
    check_delete(:entity_connection)
    deal_entity      = role.deal_entities.find(params[:deal_entity_id])
    deal_entity_user = deal_entity.deal_entity_users.find_by(deal_entity_id: params[:deal_entity_id])
    if deal_entity_user.created_to_dos.empty?
      if deal_entity.responsible_parties.any?
        flash.now[:error] = "Cannot remove an entity assigned as a responsible party in the deal"
        render 'shared/blank' and return
      end
      role.role_links.find_by(deal_entity_id: deal_entity.id).destroy
      @entity = deal_entity.entity
      if deal_entity.role_links.empty?
        deal_entity_user.to_dos.map{|to_do| to_do.update(deal_entity_user_id: nil)}
        deal_entity.destroy
      end
      flash.now[:success] = "Individual successfully removed from the deal"
      render 'counsel/deal_entities/update' and return
    else
      flash.now[:error] = "The collaborator has created To-do's and cannot be removed"
      render "shared/blank" and return
    end
  end

  private

  def deal
    @deal ||= current_entity_user.all_deals.find(params[:deal_id])
  end

  def deal_entity_user
    @deal_entity_user ||= deal.deal_entity_users.find(params[:deal_individual_user_id])
  end

  def user_params
    params.require(:user).permit(:first_name, :last_name, :email, :phone)
  end

  def role
    @role ||= deal.roles.find(params[:role_id])
  end

  def run_creation_transaction
    DealEntity.transaction do
      begin
        if @user.present?
          @entity = create_individual(@user)
          @entity_user = @entity.entity_users.find{ |entity_user| entity_user.user_id == @user.id }
          if @entity_user.nil?
            @entity_user = create_new_entity_user(@user, @entity)
          end
        else
          @entity_user = create_new_user_and_entity_user
        end

        if @entity_user
          # create new deal entity, add roles to new deal_entity, and create deal entity user
          @deal_entity = deal.deal_entities.find_or_initialize_by(entity_id: @entity.id)
          begin
            @deal_entity.roles << @role
          rescue
            flash.now[:error] = "Individual already is in this role"
            return false
          end
          @deal_entity.save!
          @deal_entity.create_tree_element_restriction(@role)
          deal_entity_user = @deal_entity.deal_entity_users.find_or_create_by!(entity_user_id: @entity_user.id, role: "client")

          create_entity_connections(current_entity, @entity)
          true
        else
          false
        end
      rescue
        false
      end
    end
  end

  def check_success_and_render(success)
    if success
      send_deal_email(@entity_user, deal)
      flash.now[:success] = "Individual successfully added to the deal"
      render 'counsel/deal_entities/update'
    else
      render :new
    end
  end

  def create_new_user_and_entity_user
    @user = User.new(user_params)
    @user.skip_confirmation_notification!
    @user.save
    if @user.persisted?
      @entity = create_individual(@user)
      create_new_entity_user(@user, @entity)
    else
      false
    end
  end

  def create_individual(user)
    Individual.find_or_create_by!(name: user.email, is_counsel: false)
  end

  def create_new_entity_user(user, entity)
    entity_user = entity.entity_users.new(user_id: user.id)
    entity_user.bypass_title_validation = true
    if entity_user.save
      entity_user
    else
      false
    end
  end
end
