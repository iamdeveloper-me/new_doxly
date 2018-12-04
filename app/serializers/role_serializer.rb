class RoleSerializer < ApplicationSerializer
  attributes :id, :name, :created_at, :updated_at

  has_many :deal_entities
  has_many :role_links
  has_many :tree_element_restrictions
end