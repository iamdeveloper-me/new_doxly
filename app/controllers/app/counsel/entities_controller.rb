class App::Counsel::EntitiesController < App::ApplicationController
  include Controllers::EntityConnections
  require 'fuzzy_match'

  def refresh_list
    check_create(:entity_connection)
    @new_deal = params[:new_deal]
    @search_term = params[:filter_text]

    # only populate with current connections in manage people modal.
    if @new_deal && @search_term == ""
      @entities       = current_entity.connected_clients.limit(5)
    elsif @new_deal
      @entities       = (FuzzyMatch.new(Organization.where(is_counsel: false), :read => :name, find_all_with_score: true, threshold: 0.5).find(@search_term).select{|org| org.last > 0.5}.take(5).map{|org| org.first})
    elsif @search_term == "" && params[:deal_id]
      @entities       = current_entity.connected_entities.limit(5)
    elsif params[:type]
      @entities       = (FuzzyMatch.new(Organization.where(is_counsel: params[:type] == "law_firm" ? true : false), :read => :name, find_all_with_score: true, threshold: 0.5).find(@search_term).select{|org| org.last > 0.5}.take(5).map{|org| org.first})
    elsif @search_term.length < 3
      @entities       = (FuzzyMatch.new(Organization.all, :read => :name, find_all_with_score: true, threshold: 0.5).find(@search_term).select{|org| org.last > 0.5}.take(5).map{|org| org.first})
    else
      @entities       = FuzzyMatch.new(Organization.all, :read => :name, find_all: true, threshold: 0.5).find(@search_term).take(5)
    end
    @deal             = current_entity_user.all_deals.find(params[:deal_id]) if params[:deal_id]
    @role             = @deal.roles.find_by(id: params[:role_id]) if params[:deal_id] && params[:role_id]
    @entity           = Organization.new
    @new_deal         = params[:new_deal]
  end

  def index
    check_read(:entity)
    if params[:type] == 'law_firm'
      @entity_connections = current_entity.entity_connections.firms
      @are_law_firms = true
    else
      @entity_connections = current_entity.entity_connections.parties
      @are_law_firms = false
    end
  end

  def update
    check_update(:entity)
    @entity = current_entity.connected_entities.find(params[:id])
    if !@entity.is_active?
      @entity.update(name: entity_params[:name])
    end
    redirect_to action: 'index', type: params[:type]
  end

  protected

  def module_to_validate
    :has_my_entity
  end

end
