class SignatureGroupSerializer < ApplicationSerializer
  attributes :id, :name, :created_at, :updated_at, :deal_id

  belongs_to :deal
  has_many   :block_collections
  has_many   :signature_entities
end
