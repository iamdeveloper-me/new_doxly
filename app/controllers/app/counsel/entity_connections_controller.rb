class App::Counsel::EntityConnectionsController < App::ApplicationController
  include Controllers::EntityConnections

  def new
    check_create(:entity_connection)
    @entities = []
    entity
  end

  def edit
    check_update(:entity_connection)
    entity_connection
    entity
  end

  def create
    check_create(:entity_connection)
    @entity = Entity.find(params[:entity_id]) if params[:entity_id]
    if save_entity_connections_and_entities(entity, entity_connection)
      entity.build_primary_address(primary_address_params).save
      if entity_connection.is_pending
        flash.now[:success] = "Connection Request Sent"
        @class = "new-party"
      else
        flash.now[:success] = "Connection Created"
        @class = "new-law-firm"
      end
    else
      @errors = "people_page"
      @deal = current_entity_user.all_deals.find(params[:deal_id]) if params[:deal_id]
      @search_term = params[:entity][:name]
      @entities = FuzzyMatch.new(Entity.all, :read => :name, find_all_with_score: true, threshold: 0.5).find(@search_term).select{|org| org.last > 0.5}.take(5).map{|org| org.first} - [current_entity]
      render 'create_errors' and return
    end
  end

  def resend_connection_invitation
    check_read(:entity_connection)
    entity_connection = current_entity.entity_connections.find(params[:entity_connection_id])
    InvitationMailer.entity_connection_invitation_email(entity_connection).deliver_later
    flash.now[:success] = "Invitation Successfully Re-sent"
    render "shared/blank"
  end


  def update
    check_update(:entity_connection)
    entity_connection
    entity
    entity.assign_attributes(entity_params)
    if entity.valid?
      entity.save
      flash[:success] = "#{entity_type_text} has been updated successfully"
      respond_to_path(entities_path(:type => params[:type])) and return
    else
      render :edit and return
    end
  end

  def add_address
    check_update(:entity)
    @search_term = params[:search_term]
    entity
  end

  protected

  def entity
    @entity ||= entity_connection.new_record? ? entity_connection.build_connected_entity : entity_connection.connected_entity
  end

  def entity_type_text
    params[:type] == "law_firm" ? "Law Firm" : "Party"
  end

end
