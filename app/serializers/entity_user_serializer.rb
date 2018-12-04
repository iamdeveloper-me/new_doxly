class EntityUserSerializer < ApplicationSerializer
  attributes :id, :entity_id, :user_id, :email_digest_preference, :role, :title, :created_at, :updated_at

  belongs_to :user
  belongs_to :entity
end
