class Api::V1::EntitiesController < Api::V1::ApplicationController
 include Controllers::Api::EntityConnections
 require 'fuzzy_match'
  
  api!
  def refresh_list
    check_create(:entity_connection)
    new_deal = params[:new_deal]
    search_term = params[:filter_text]
    # only populate with current connections in manage people modal.
    if new_deal && search_term == ""
      entities       = current_entity.connected_clients.limit(5)
      render_success(entities) and return
    elsif new_deal
      entities       = (FuzzyMatch.new(Organization.where(is_counsel: false), :read => :name, find_all_with_score: true, threshold: 0.5).find(search_term).select{|org| org.last > 0.5}.take(5).map{|org| org.first})
      render_success(entities) and return
    elsif search_term == "" && params[:deal_id]
      entities       = current_entity.connected_entities.limit(5)
      render_success(entities) and return
    elsif params[:type]
      entities       = (FuzzyMatch.new(Organization.where(is_counsel: params[:type] == "law_firm" ? true : false), :read => :name, find_all_with_score: true, threshold: 0.5).find(search_term).select{|org| org.last > 0.5}.take(5).map{|org| org.first})
      render_success(entities) and return
    elsif search_term.length < 3
      entities       = (FuzzyMatch.new(Organization.all, :read => :name, find_all_with_score: true, threshold: 0.5).find(search_term).select{|org| org.last > 0.5}.take(5).map{|org| org.first})
      render_success(entities) and return
    else
      entities       = FuzzyMatch.new(Organization.all, :read => :name, find_all: true, threshold: 0.5).find(search_term).take(5)
      render_success(entities) and return
    end
    deal             = current_entity_user.all_deals.find(params[:deal_id]) if params[:deal_id]
    role             = deal.roles.find_by(id: params[:role_id]) if params[:deal_id] && params[:role_id]
    entity           = Organization.new
    new_deal         = params[:new_deal]
  end

  def index
    check_read(:entity)
    if params[:type] == 'law_firm'
      entity_connections = current_entity.entity_connections.firms
      law_users = current_entity_type(entity_connections)
      are_law_firms = true
      render_success(law_users)
    else
      entity_connections = current_entity.entity_connections.parties
      party_users = current_entity_type(entity_connections)
      are_law_firms = false
      render_success(party_users)
    end
  end

  api!
  def update
    check_update(:entity)
    entity = current_entity.connected_entities.find(params[:id])
    if !entity.is_active?
      entity.update(name: entity_params[:name])
      render_success(entity)
    else
      render_validation_failed(entity.errors.full_messages)
    end
  end

  protected

  def module_to_validate
    :has_my_entity
  end
  
  private

  def current_entity_type(entity_connections)
    users = [] 
    entity_connections.each do |ec|
      ec.connected_entity.entity_users.each do |eu|
        users << eu.user
      end
    end
    users
  end

  # def all_current_entity
  #   users = []
  #   current_entity.entity_users.each do |eu|
  #     users << eu.user
  #   end
  #   users.uniq
  # end

end
