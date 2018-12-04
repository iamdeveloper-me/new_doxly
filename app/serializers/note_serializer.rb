class NoteSerializer < ApplicationSerializer
  attributes :id, :text, :is_public, :created_at, :updated_at

  belongs_to :entity_user
end
