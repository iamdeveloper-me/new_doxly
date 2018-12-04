class ToDoSerializer < ApplicationSerializer
  attributes :id, :text, :is_complete, :deal_entity_user_id, :position, :created_at, :updated_at

  belongs_to :deal_entity_user
  has_many   :due_dates
end
