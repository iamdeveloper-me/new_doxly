module Controllers::SignaturePackets
  extend ActiveSupport::Concern
  include Controllers::OwningEntity
  include Controllers::SignatureChecks

  def self.included(base)
    base.layout 'deals'
  end

  def index
    check_read(:signature_management)
    documents
    users_with_signing_capacities
    render 'app/shared/signature_packets/index'
  end

  private

  def deal
    @deal ||= current_entity_user.all_deals.find_by(:id => params[:deal_id])
  end

  def documents
    restricted_tree_element_ids = current_deal_entity_user.tree_element_restrictions.pluck(:tree_element_id)
    @documents ||= deal.closing_category.documents_requiring_signature_with_position.reject{ |tree_element| restricted_tree_element_ids.include?(tree_element.id) }
  end

  def signing_capacities
    @signing_capacities ||= deal.all_signing_capacities.sort_by{ |signing_capacity| [(signing_capacity.full_name.downcase || ""), (signing_capacity.placeholder_id || 0)] }
  end

  def users_with_signing_capacities
    @users_with_signing_capacities = signing_capacities.group_by{ |signing_capacity| signing_capacity.reload.user }
  end

end
