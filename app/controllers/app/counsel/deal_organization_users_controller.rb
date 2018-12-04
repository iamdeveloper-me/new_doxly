class App::Counsel::DealOrganizationUsersController < App::ApplicationController
  include Controllers::EntityConnections
  include Controllers::DealEmails
  layout 'deals'

  before_action do
    assert_counsel_entity
  end

  def new
    check_create(:entity_connection)
    @entity = deal_entity.entity
    entity_user.build_user
  end

  def create
    check_create(:entity_connection)
    @deal_entity = deal.deal_entities.find(params[:deal_entity_id])
    @entity = @deal_entity.entity

    # if the there's already an entity_user in the right entity, but not in the deal
    if params[:entity_user_id]
      render_unauthorized and return unless current_entity.all_entity_user_ids.include?(params[:entity_user_id].to_i)

      # instantiating user to send the email below
      @entity_user = @entity.entity_users.find(params[:entity_user_id])
      add_entity_user_to_deal(@entity)

    # if there's already a user but not in the right entity
    elsif user = User.find_by(email: params[:user][:email]&.downcase)
      # will already be confirmed on the front-end
      @entity_user = create_entity_user(user, @entity)
      unless @entity_user.persisted?
        render :new and return
      end
      create_deal_entity_user(@entity_user.id)

    # no user, entity_user, or deal_entity_user
    else
      entity_user.assign_attributes(entity_user_params)
      entity_user.entity_id = entity.id

      # both creates and saves the user and entity_user
      user, @entity_user = save_entity_user_and_user(entity_user, false)
      unless @entity_user.persisted? && user.persisted?
        user.errors.full_messages.each do |msg|
          # you can customize the error message here:
          @entity_user.errors[:base] << msg
        end
        render :new and return
      end

      create_deal_entity_user(@entity_user.id)
    end

    @role_ids = @deal_entity.roles.map{|role| role.id }
    send_deal_email(@entity_user, deal)
    render :update and return
  end

  def destroy
    check_delete(:entity_connection)
    if deal_entity_user.is_owner?
      flash.now[:error] = "The owner of the deal cannot be removed"
      render "shared/blank" and return
    elsif deal_entity_user.can_see_all_deals?
      flash.now[:error] = "Firm administrators are automatically added to every deal and cannot be removed"
      render "shared/blank" and return
    elsif deal_entity_user.created_to_dos.any?
      flash.now[:error] = "The collaborator has created To-do's and cannot be removed"
      render "shared/blank" and return
    else
      @deal_entity = deal_entity_user.deal_entity
      deal_entity_user.to_dos.map{|to_do| to_do.update(deal_entity_user_id: nil)}
      if !deal_entity_user.user.confirmed? && deal_entity_user.user.deal_entity_users.count == 1 && !deal_entity_user.user.signing_capacities.any?
        deal_entity_user.user.destroy
        flash.now[:success] = "User successfully deleted"
      else
        deal_entity_user.destroy
        flash.now[:success] = "Collaborator has been successfully removed from the deal"
      end
    end
    @role_ids = deal_entity.roles.map{|role| role.id }
    render 'update'
  end

  private

  def deal
    @deal ||= current_entity_user.all_deals.find_by(:id => params[:deal_id])
  end

  def deal_entity
    @deal_entity = deal.deal_entities.find(params[:deal_entity_id])
  end

  def entities
    @entities ||= current_entity.connected_entities.where.not(:id => deal.entity_users.map{ |ou| ou.entity_id }.uniq).order(:name)
  end

  def entity
    @entity ||= if params[:entity_id].blank?
      entity_connection.build_connected_entity
    else
      params[:entity_id] == current_entity.id.to_s ? current_entity : current_entity.connected_entities.find_by(:id => params[:entity_id])
    end
  end

  def deal_entity_user
    @deal_entity_user ||= params[:deal_organization_user_id].blank? && params[:id].blank? ? deal.deal_entity_users.new : deal_entity.deal_entity_users.find(params[:deal_organization_user_id] || params[:id])
  end

  def create_deal_entity_user(entity_user_id)
    @deal_entity_user = deal.add_entity_user(entity_user_id, deal.deal_entities.find(params[:deal_entity_id]))
    if @deal_entity_user.save
      flash.now[:success] = "Collaborator has been added to the deal successfully"
    end
  end

  def assert_counsel_entity
    render_unauthorized and return unless current_entity.is_counsel?
  end

  def add_entity_user_to_deal(entity)
    entity_user = entity.entity_users.find(params[:entity_user_id])
    create_deal_entity_user(params[:entity_user_id])
    send_deal_invitation
  end

end
