class EntityUserSerializer < ApplicationSerializer
	attributes :id, :entity_id, :user_id, :email, :name, :email_digest_preference, :role, :title, :created_at, :updated_at

	belongs_to :user
	belongs_to :entity

	def email
		object.user.email
	end

	def name
		object.user.name
	end

end