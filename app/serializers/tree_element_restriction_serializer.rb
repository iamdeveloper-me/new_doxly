class TreeElementRestrictionSerializer < ApplicationSerializer
  attributes :id, :inherit, :tree_element_id, :restrictable_id, :restrictable_type

  has_one :tree_element
  has_one :restrictable
end