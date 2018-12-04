module Controllers::Categories
  extend ActiveSupport::Concern

  def self.included(base)
    base.layout 'deals', only: [:show]
  end

  def show
    check_read(:deals)
    category
    reset_authentication_token
    render 'shared/deals/categories/show'
  end

  protected

  def reset_authentication_token
    current_user.authentication_token = nil
    current_user.bypass_password_validation = true
    current_user.save!
    current_user.update_authentication_cookie(cookies, current_entity_user.id)
  end

  def deal
    @deal ||= current_entity_user.all_deals.find_by(:id => params[:deal_id])
  end

  def category
    @category ||= deal.categories.find(params[:id])
  end

end
