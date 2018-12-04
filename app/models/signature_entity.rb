class SignatureEntity < ActiveRecord::Base
  include Models::Addressable
  has_ancestry

  belongs_to :block, inverse_of: :signature_entity
  has_many   :signing_capacities, ->{ order('id asc') }, inverse_of: :signature_entity, dependent: :destroy, :autosave => true
  has_one    :block_collection, through: :block
  has_one    :signature_group, through: :block_collection
  has_one    :copy_to_address, as: :addressable, dependent: :destroy, autosave: true, :inverse_of => :addressable
  has_one    :primary_address, as: :addressable, dependent: :destroy, autosave: true, :inverse_of => :addressable

  validates_presence_of :name
  validate :belongs_to_block_or_has_ancestry

  accepts_nested_attributes_for :signing_capacities, allow_destroy: true
  accepts_nested_attributes_for :primary_address, allow_destroy: true
  accepts_nested_attributes_for :copy_to_address, allow_destroy: true

  scope :as_tree, -> { arrange(:order => :id) }

  def belongs_to_block_or_has_ancestry
    unless block.present? ^ ancestry.present?
      errors.add(:signature_entity, "Must belong to block or have ancestry, but not both")
    end
  end

  def all_signing_capacities
    descendants.length > 0 ? last_descendant.signing_capacities.includes(:user) : signing_capacities.includes(:user)
  end

  def included?(tree_element_id)
    included = true

    signing_capacities = self.descendants.any? ? self.last_descendant.signing_capacities : self.signing_capacities
    signing_capacities.each do |signing_capacity|
      included = signing_capacity.signature_pages
        .joins(:tree_element_signature_group)
        .where(tree_element_signature_groups: { tree_element_id: tree_element_id })
        .any?
    end
    return included
  end

  # descendants.last does a rails search and is not corresponding to the actual last descendant and is breaking. So, have to do it by descendant_ids
  def last_descendant
    # TODO: Find a way to not use SignatureEntity directly. Had to do this due to time limitation.
    SignatureEntity.find(descendant_ids.last)
  end
end
