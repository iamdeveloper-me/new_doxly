class DealEntityUserSerializer < ApplicationSerializer
  attributes :id, :is_owner, :role, :created_at, :updated_at, :entity

  belongs_to  :entity_user
  has_many    :tree_element_restrictions
  has_one     :deal_entity

  def entity
    object.deal_entity.entity
  end
end
