class App::Counsel::DealsController < App::ApplicationController
  include Controllers::Deals
  include Controllers::EntityConnections

  DEFAULT_PARAMS = {
    :is_active => true
  }

  def new
    check_create(:deals)
    deal
    initialize_deal_types
  end

  def edit
    check_update(:deal)
    render_unauthorized and return unless deal.is_owning_entity?(current_entity)
    deal
    initialize_deal_types
  end

  def create
    check_create(:deals)
    deal.assign_attributes(DEFAULT_PARAMS.merge(deal_params))
    if deal.save
      owning_deal_entity = deal.create_deal_team(current_entity, current_entity_user)

      deal.create_or_update_dms_deal_storage_detailable({})

      role1 = deal.roles.create(name: "Role 1")
      owning_deal_entity.roles << role1

      flash[:success] = "Deal has been created successfully"
      respond_to_path(deal_roles_path(deal)) and return
    end
    initialize_deal_types
    respond_to_turboboost('deal_form', '.modal-body')
  end

  def update
    check_update(:deal)
    deal.assign_attributes(deal_params)
    if deal.save
      deal.create_or_update_dms_deal_storage_detailable({})
      flash[:success] = "Deal has been updated successfully"
      path = if params[:redirect_to] == "diligence" && deal.has_diligence
        deal_category_path(deal, deal.diligence_category)
      elsif params[:redirect_to] == "closing"
        deal_category_path(deal, deal.closing_category)
      elsif params[:redirect_to] == "closing_books"
        deal_closing_books_path(deal)
      elsif params[:redirect_to] == "signature_pages"
        deal_signature_pages_path(deal)
      else
        deal_roles_path(deal)
      end
      respond_to_path(path) and return
    end
    initialize_deal_types
    respond_to_turboboost('deal_form', '.modal-body')
  end

  def add_address
   check_read(:deals)
   @search_term = params[:search_term]
   deal
   entity
  end

  def archive
    check_update(:deal)
    unless deal.archived?
      deal.archive!
      current_entity.events.create(module: 'Deal', action: "DEAL_ARCHIVED", eventable: deal, entity_user_id: current_entity_user.id, associatable_type: 'Deal', associatable_id: deal.id)
    end
    redirect_to :back
  end

  def unarchive
    check_update(:deal)
    if deal.archived?
      deal.unarchive!
      current_entity.events.create(module: 'Deal', action: "DEAL_UNARCHIVED", eventable: deal, entity_user_id: current_entity_user.id, associatable_type: 'Deal', associatable_id: deal.id)
    end
    redirect_to :back
  end

  def close
    check_update(:deal)
    render_unauthorized and return unless deal.is_owning_entity?(current_entity)
    unless deal.closed?
      deal.close!
      # expire all the login tokens
      deal.login_tokens.update_all :is_active => false
      current_entity.events.create(module: 'Deal', action: "DEAL_CLOSED", eventable: deal, entity_user_id: current_entity_user.id, associatable_type: 'Deal', associatable_id: deal.id)
    end
    redirect_to :back
  end

  def reopen
    check_update(:deal)
    if deal.closed?
      deal.reopen!
      # zombify (bring back from the dead) all the login tokens
      deal.login_tokens.update_all :is_active => true
      current_entity.events.create(module: 'Deal', action: "DEAL_REOPENED", eventable: deal, entity_user_id: current_entity_user.id, associatable_type: 'Deal', associatable_id: deal.id)
    end
    redirect_to :back
  end

  def signature_page_settings
    check_update(:deal)
    deal
  end

  def executed_versions
    check_update(:deal)
  end

  def export_tracker
    check_update(:deal)
    render xlsx: 'signature_tracker'
  end

  def voting_threshold
    check_read(:voting_threshold)
    redirect_to deal_signature_groups_url if !deal.has_voting_threshold
  end

  def set_critical_errors_as_read
    check_update(:deal)
    deal.critical_errors.update_all(is_read: true)
    render 'shared/blank' and return
  end

  private

  def entity
    @entity ||= if params[:entity_id].blank?
      if params[:entity] && params[:entity][:name]
        Entity.new(entity_params)
      else
        Entity.new
      end
    else
      params[:entity_id] == current_entity.id.to_s ? current_entity : current_entity.connected_entities.find_by(:id => params[:entity_id])
    end
  end

  def deal_params
    params.require(:deal).permit(:title, :deal_type_id, :deal_size, :projected_close_date, :status, :client_matter_number, :use_deal_email, :deal_email, :has_diligence, :has_voting_threshold, :font_size, :font_type)
  end

  def initialize_deal_types
    @deal_types = DealType.all
  end

end
