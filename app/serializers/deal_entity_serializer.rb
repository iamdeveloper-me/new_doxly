class DealEntitySerializer < ApplicationSerializer
  attributes :id, :is_owner, :created_at, :updated_at

  belongs_to :entity
  belongs_to :deal
  has_many :deal_entity_users
  has_many :tree_element_restrictions
end
