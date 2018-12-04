class App::Client::DealsController < App::ApplicationController
  include Controllers::Deals

  private

  def deal
    @deal ||= (params[:id].blank? && params[:deal_id].blank?) ? current_entity.deals.new : current_entity_user.all_deals.find_by(:id => (params[:deal_id] || params[:id]))
  end
end
