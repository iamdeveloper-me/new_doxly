class DealSerializer < ApplicationSerializer
  attributes :id, :created_at, :updated_at, :features, :has_voting_threshold, :number_of_placeholder_signers

  has_one :dms_deal_storage_details

  def features
    Entity::FEATURES[object.owner_entity.product.to_sym]
  end
end
