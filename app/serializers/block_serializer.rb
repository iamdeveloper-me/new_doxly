class BlockSerializer < ApplicationSerializer
  attributes :id, :block_collection_id, :position, :created_at, :updated_at

  has_one    :signing_capacity
  has_one    :signature_entity
  has_many   :voting_interests
  belongs_to :block_collection

  def signature_entity
    object&.signature_entity&.subtree&.arrange_serializable do |parent, children|
      SignatureEntitySerializer.new(
        parent,
        {
          scope: {
            children: children
          }
        }
      )
    end
  end

end
