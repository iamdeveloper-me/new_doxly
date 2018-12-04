class BlockCollectionSerializer < ApplicationSerializer
  attributes :id, :signature_group_id, :created_at, :updated_at, :is_consolidated, :has_sent_packets

  belongs_to :signature_group
  has_many   :blocks
  has_many   :signature_page_collections

  def has_sent_packets
    object.has_sent_packets?
  end
end
