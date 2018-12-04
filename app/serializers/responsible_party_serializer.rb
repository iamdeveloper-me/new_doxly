class ResponsiblePartySerializer < ApplicationSerializer
  attributes :id, :is_active, :created_at, :updated_at

  belongs_to :tree_element
  belongs_to :deal_entity
  belongs_to :deal_entity_user
end
