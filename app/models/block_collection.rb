class BlockCollection < ActiveRecord::Base
  belongs_to :signature_group
  has_many   :blocks, inverse_of: :block_collection, dependent: :destroy
  has_many   :signing_capacities, through: :blocks
  has_many   :signature_entities, through: :blocks
  has_many   :signature_page_collections, dependent: :destroy

  validates_presence_of :signature_group
  accepts_nested_attributes_for :blocks, allow_destroy: true

  def has_sent_packets?
    signature_page_collections.any?{ |signature_page_collection| signature_page_collection.signature_packet.present? }
  end

  def consolidated_blocks
    entity_signing_capacities = signature_entities.map(&:all_signing_capacities).flatten

    entity_signing_capacities.group_by{ |signing_capacity|
      rootEntity = signing_capacity.signature_entity.root
      primary_address = rootEntity.primary_address ? rootEntity.primary_address.slice(:address_line_one, :address_line_two, :city, :state_or_province, :postal_code) : nil
      copy_to_address = rootEntity.copy_to_address ? rootEntity.copy_to_address.slice(:address_line_one, :address_line_two, :city, :state_or_province, :postal_code) : nil
      [
        signing_capacity.signature_entity.signing_capacities.sort.map{|signing_capacity| { user_id: signing_capacity.user.id, title: signing_capacity.title } },
        primary_address,
        copy_to_address
      ]
    }
  end
end
