class SignaturePageCollectionSerializer < ApplicationSerializer

  attributes :id, :tree_element_signature_group_id, :block_collection_id, :created_at, :updated_at

  belongs_to :signature_packet
  belongs_to :tree_element_signature_group
  belongs_to :block_collection
  has_many   :signature_pages
end
