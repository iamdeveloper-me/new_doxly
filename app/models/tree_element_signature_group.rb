class TreeElementSignatureGroup < ActiveRecord::Base
  include Models::Signable

  belongs_to :signature_group
  belongs_to :tree_element
  has_many   :signature_page_collections, dependent: :destroy
  has_many   :signature_pages, through: :signature_page_collections
  has_many   :signature_packets, through: :signature_page_collections
  has_many   :block_collections, through: :signature_group
  has_many   :blocks, through: :block_collections

  validates_presence_of :tree_element, :signature_group
  validates_uniqueness_of :signature_group, { scope: :tree_element, message: "can only be assigned a signature group once" }
  validate :must_belong_to_deal_to_have_tree_elements


  def recently_complete_signature_packet
    self.signature_packets.order('completed_at desc').first
  end

  def template_signature_page
    template_signature_pages.first
  end

  def template_signature_pages
    signature_pages.where(:use_template => true)
  end

  def ready_template_signature_page
    ready_template_signature_pages.first
  end

  def ready_template_signature_pages
    signature_pages.select{ |signature_page| signature_page.is_custom == false && !signature_page.is_part_of_multiple? }
  end

  def enable_custom_signature_page?
    ready_template_signature_page.present? || template_signature_page.present?
  end

  def create_signature_pages(signing_capacity=nil, enabled=true)
    # if a single signing_capacity is specified
    if signing_capacity
      create_full_signature_page(signing_capacity, enabled)
    else
      # create for all
      signature_group.all_signing_capacities.map do |signing_capacity|
        create_full_signature_page(signing_capacity, enabled)
      end
    end
  end

  def create_full_signature_page(signing_capacity, enabled)
    user                                        = signing_capacity.user
    signing_capacity_block_collection_id        = signing_capacity.get_block_collection.id
    # find pre-existing signature_page_collection for this user
    block_collection_signature_page_collections = self.signature_page_collections.where(block_collection_id: signing_capacity_block_collection_id)
    # find any empty signature page collections that need to be destroyed
    existing_empty_signature_page_collections   = block_collection_signature_page_collections.select{ |signature_page_collection| signature_page_collection.signature_pages.empty? }
    existing_signature_page_collection          = block_collection_signature_page_collections.find{ |signature_page_collection| signature_page_collection.signature_pages.any? && (signature_page_collection.signature_pages.first.signing_capacity.user == user) }
    signature_page_collection                   = existing_signature_page_collection || self.signature_page_collections.create(block_collection_id: signing_capacity.get_block_collection.id)
    signature_page                              = signing_capacity.signature_pages.create ({
                                                    tree_element_signature_group_id: self.id,
                                                    is_enabled: enabled,
                                                    signature_status: 'not_sent',
                                                    signature_status_timestamp: Time.now.utc,
                                                    signature_page_collection_id: signature_page_collection.id
                                                  })
    # destroy the blank signature page collections
    existing_empty_signature_page_collections.each(&:destroy)
  end

  def has_linked_blocks?
    block_collections.any?{|block_collection| block_collection.blocks.count > 1}
  end

  private

  def must_belong_to_deal_to_have_tree_elements
    if signature_group&.deal_id.nil?
      errors.add(:tree_element, "Can only assign signature groups that belong to a deal")
      false
    end
  end
end
