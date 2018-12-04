class App::Counsel::DealEntitiesController < App::ApplicationController
  include Controllers::EntityConnections

  def index
    check_read(:entity_connection)
    render_unauthorized and return unless deal.is_owning_entity?(current_entity)
    @deal_entities = deal.deal_entities
  end

  def new
    check_create(:entity_connection)
    @entities = current_entity.connected_entities.where(type: 'Organization').limit(5)
    @role     = deal.roles.find_by(id: params[:role_id])
    deal
    entity
  end

  def create
    check_create(:entity_connection)
    deal
    @role = deal.roles.find_by(id: params[:role_id])
    @deal_entity = deal.deal_entities.find_by(entity_id: params[:entity_id])
    if @deal_entity
      @deal_entity.create_tree_element_restriction(@role)
    else
      if entity.new_record? || !current_entity.connected_entities.include?(entity)
        # save_entity is an odd duck of a method that can both save a new entity and create an entity_connection for an existing one. Probably should be two methods, but it's used all over.
        if !save_entity_connections_and_entities(entity, entity_connection)
          render :add_address and return
        end
      end
      @deal_entity = entity.reload.deal_entities.create(:deal_id => deal.id)
      @deal_entity.build_primary_address(primary_address_params)
      @deal_entity.create_tree_element_restriction(@role)
      @deal_entity.deal_entity_users.find_or_create_by!(entity_user_id: entity.entity_users.first.id, role: "client") if entity.type == 'Individual'

    end
    # give the role to the deal_entity
    @deal_entity.roles << @role
    @class = entity.is_counsel ? 'new-law-firm' : 'new-party'
    @deal_entities = deal.deal_entities
    render 'update'
  end

  def destroy
    check_delete(:deal_entity)
    @deal_entity    = deal.deal_entities.find(params[:id])
    @entity         = @deal_entity.entity
    @role           = deal.roles.find_by(id: params[:role_id])
    if deal.roles.map(&:deal_entities).flatten.select{|deal_org| deal_org == @deal_entity}.length == 1
      responsible_parties = @deal_entity.responsible_parties
      deal_entity_users = @deal_entity.deal_entity_users
      if responsible_parties.any? || deal_entity_users.any?
        flash.now[:error] = 'Cannot remove an entity assigned as a responsible party in the deal' if responsible_parties.any?
        flash.now[:error] = 'Cannot remove an entity with active users in the deal' if deal_entity_users.any?
        render 'shared/blank' and return
      else
        # actually destroy the deal_entity
        @deal_entity_id     = @deal_entity.id
        @deal_entity.destroy
        flash.now[:success] = 'Entity successfully removed from the deal'
        @deal_entities      = deal.deal_entities
      end
    else
      # just remove from the role
      @role.role_links.find_by(deal_entity_id: @deal_entity.id).destroy
      @deal_entity_id     = @deal_entity.id
      flash.now[:success] = 'Entity successfully removed from the role'
      @deal_entities      = deal.deal_entities
    end
    render 'update'
  end

  def add_address
    check_create(:entity_connection)
    @role         = deal.roles.find_by(id: params[:role_id])
    @search_term  = params[:search_term]
    deal
    entity
  end

private

  def deal
    @deal = current_entity_user.all_deals.find(params[:deal_id])
  end

  def entity
    @entity ||= if params[:entity_id].blank?
      entity_connection.build_connected_entity
    else
      params[:entity_id] == current_entity.id.to_s ? current_entity : current_entity.connected_entities.find_by(:id => params[:entity_id]) || Entity.find(params[:entity_id])
    end
  end

end
