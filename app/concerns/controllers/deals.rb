module Controllers::Deals
  extend ActiveSupport::Concern

  def self.included(base)
    base.layout 'deals', only: [:voting_threshold, :closing_book]
  end

  def index
    check_read(:deals)
    @deals        = group_by_sort(all_deals.open, 'date')
  end

  def refresh_list
    check_read(:deals)
    sorts = [{:column => params[:sort_field], :direction => 'ASC'}]
    relation = if params[:filter_field] == "internal"
      all_my_deals
    elsif params[:filter_field] == "external"
      all_collaborating_deals
    else
      all_deals
    end
    if params[:filter_field] == "status"
      if params[:filter_field_value] == "open"
        relation = relation.open
      elsif params[:filter_field_value] == "closed"
        relation = relation.closed
      elsif params[:filter_field_value] == "archived"
        relation = relation.complete
      end
    end
    relation = params[:sortField] || params[:filter_field] ? relation.filter_sort_and_page(params[:filter_text], Deal::SEARCH_FIELDS, sorts) : all_deals
    sort_field = params[:sort_field] ? params[:sort_field] : nil
    @deals   = group_by_sort(relation, sort_field)
  end

  def star
    check_read(:deal)
    starred_deal = current_entity_user.starred_deals.find_or_initialize_by :deal_id => deal.id
    starred_deal.save if starred_deal.new_record?
    redirect_to :back
  end

  def unstar
    check_read(:deal)
    starred_deal = current_entity_user.starred_deals.find_or_initialize_by :deal_id => deal.id
    starred_deal.destroy unless starred_deal.new_record?
    redirect_to :back
  end

  private

  def group_by_sort(relation, sort_field)
    case sort_field
    when 'title'
      relation.sort_by{ |d| d.title.downcase }.group_by{ |d| d.title[0].downcase }
    when 'deal_type_id'
      relation.group_by{ |d| d.deal_type.name }.sort
    else
      relation.order('projected_close_date ASC').group_by{ |d| d.projected_close_date.strftime('%B %Y') }
    end
  end

  def deal
    @deal ||= (params[:id].blank? && params[:deal_id].blank?) ? current_entity.owned_deals.new : current_entity_user.all_deals.find_by(:id => (params[:deal_id] || params[:id]))
  end

  def all_deals
    current_entity_user.all_deals.includes(:categories, :deal_entity_users => { :entity_user => :user })
  end

  def all_my_deals
    current_entity_user.my_deals.includes(:deal_entity_users => { :entity_user => :user})
  end

  def all_collaborating_deals
    current_entity_user.collaborating_deals.includes(:deal_entity_users => { :entity_user => :user})
  end

end
