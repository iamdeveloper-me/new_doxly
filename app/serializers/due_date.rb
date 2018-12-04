class DueDateSerializer < ApplicationSerializer
  attributes :id, :value, :due_dateable_id, :due_dateable_type, :entity_id, :created_at, :updated_at
end
