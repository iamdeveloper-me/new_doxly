module Controllers::Api::DealHelpers
  protected

  def deal
    @deal ||= current_entity_user.all_deals.find_by(id: params[:deal_id])
  end

  def deal_entity
    @deal_entity ||= deal.deal_entities.find_by(entity_id: current_entity.id)
  end

  def deal_entity_user
    @deal_entity_user ||= deal.deal_entity_users.find_by(entity_user_id: current_entity_user.id)
  end
end
