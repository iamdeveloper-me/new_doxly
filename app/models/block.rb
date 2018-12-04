class Block < ActiveRecord::Base
  acts_as_list scope: :block_collection

  belongs_to :block_collection, inverse_of: :blocks
  has_one    :signature_entity, inverse_of: :block, dependent: :destroy
  has_one    :signing_capacity, inverse_of: :block, dependent: :destroy
  has_many   :voting_interests, inverse_of: :block, dependent: :destroy

  validates_presence_of :block_collection
  validate :has_signature_entity_or_signing_capacity
  default_scope { order(position: :asc) }

  accepts_nested_attributes_for :signature_entity, allow_destroy: true
  accepts_nested_attributes_for :signing_capacity, allow_destroy: true
  accepts_nested_attributes_for :voting_interests, allow_destroy: true

  def has_signature_entity_or_signing_capacity
    unless signature_entity.present? ^ signing_capacity.present?
      errors.add(:base, "Block must contain either signature entity or signature capacity, but not both")
    end
  end

  def update_signature_page_collections_on_unlink
    # Because you can unlink on a per signature_entity/signing_capacity basis
    # AND
    # Because Signature Page Collections are the convergence of Block Collection, ---> USER <---, and tree_element_signature_group_id
    # The "old" signature page collections that are being updated MAY OR MAY NOT lose all of their signature pages.
    # If the signature page collection encompases more than one signing_capacity for the same user, only the signature pages for the newly unlinked signing_capacity will be moved to the new signature_page_collections
    # Thus, we need to destroy the 'old' signature page collection ONLY if it is empty (IE, if the signature_page_collection only has signature pages from the signing_capacity that is being "unlinked")
    if signature_entity
      signing_capacities = signature_entity.descendants.any? ? signature_entity.descendants.last&.signing_capacities : signature_entity.signing_capacities
      signature_pages = signing_capacities.map(&:signature_pages).flatten
      # create new SPC for unlinked block
      signing_capacities.map(&:signature_page_collections).flatten.each do |old_signature_page_collection|
        old_signature_pages = signature_pages.select{ |signature_page| signature_page.signature_page_collection_id == old_signature_page_collection.id }
        if old_signature_pages.any?
          new_signature_page_collection = SignaturePageCollection.create(tree_element_signature_group_id: old_signature_page_collection.tree_element_signature_group_id, block_collection_id: block_collection_id)
          new_signature_page_collection.signature_pages << old_signature_pages
        end
        old_signature_page_collection.destroy if old_signature_page_collection.reload.signature_pages.empty?
      end
    elsif signing_capacity
      signing_capacity.signature_page_collections.each do |old_signature_page_collection|
        old_signature_pages = signing_capacity.signature_pages.where(signature_page_collection_id: old_signature_page_collection.id)
        if old_signature_pages.any?
          new_signature_page_collection = SignaturePageCollection.create(tree_element_signature_group_id: old_signature_page_collection.tree_element_signature_group_id, block_collection_id: block_collection_id)
          new_signature_page_collection.signature_pages << old_signature_pages
        end
        old_signature_page_collection.destroy if old_signature_page_collection.reload.signature_pages.empty?
      end
    end
  end

  def all_signing_capacities
    Array(signing_capacity || signature_entity.signing_capacities)
  end

  def all_signature_pages
    all_signing_capacities.map(&:signature_pages).flatten
  end

  def is_signed_for_document?(document)
    all_signature_pages_for_document = all_signature_pages.select{|signature_page| signature_page.tree_element.id == document.id}
    !all_signature_pages_for_document.empty? && all_signature_pages_for_document.all?(&:is_signed?)
  end

end
