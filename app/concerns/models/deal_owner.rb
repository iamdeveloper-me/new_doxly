module Models::DealOwner
  extend ActiveSupport::Concern

  def deal_stats
    active_deals                = all_deals.where(status: Deal::ACTIVE_STATUSES)
    archived_deals              = all_deals.where(status: Deal::ARCHIVED_STATUSES)

    return {
      active_deals: active_deals.count,
      archived_deals: archived_deals.count,
    }
  end

  private

  def get_documents(scope)
    scope.joins(:document).where("documents.entity_user_id NOT IN (?)", self.entity.entity_users.pluck(:id)).order('updated_at').last(10)
  end
end
