class CompletionStatusSerializer < ApplicationSerializer
  attributes :id, :is_complete, :created_at, :updated_at, :tree_element_id, :deal_entity_id
end
