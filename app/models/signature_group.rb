class SignatureGroup < ActiveRecord::Base
  belongs_to :deal
  has_many   :block_collections, dependent: :destroy
  has_many   :tree_element_signature_groups, dependent: :destroy
  has_many   :tree_elements, through: :tree_element_signature_groups
  has_many   :signing_capacities, through: :block_collections
  has_many   :signature_entities, through: :block_collections

  validates_presence_of :name, :deal

  def all_signing_capacities
    ( signing_capacities + signature_entities.map(&:all_signing_capacities) ).flatten
  end

  def all_signature_entities
    ( signature_entities + signature_entities.map(&:descendants) ).flatten
  end

  def entity_signing_capacities
    signature_entities.map(&:all_signing_capacities)
  end
end
