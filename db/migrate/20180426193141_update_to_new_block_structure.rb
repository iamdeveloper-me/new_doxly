class UpdateToNewBlockStructure < ActiveRecord::Migration
  def change
    # pull the top level signature group out and create a SignatureGroup object for it
    top_level_signature_entities = SignatureEntity.where(ancestry: nil)

    # create a new SignatureGroup record for the top level signature entities
    top_level_signature_entities.each do |signature_entity|
      signature_group = SignatureGroup.new(deal_id: signature_entity.deal_id, name: signature_entity.name)
      signature_group.save

    # update the TreeElementSignatureGroups if the SignatureGroup has been assigned to a tree element
      tesg = TreeElementSignatureGroup.find_by(signature_entity_id: signature_entity.id)
      if tesg.present?
        tesg.signature_group = signature_group
        tesg.save
      end

    # go through each Individual SigningCapacity and create a BlockCollection and Block for them
      signature_entity.signing_capacities.each do |signing_capacity|

        block_collection = signature_group.block_collections.create

        block = block_collection.blocks.new(position: 1)
        signing_capacity.signature_entity = nil
        block.signing_capacity = signing_capacity
        block.save!
        signing_capacity.block = block
        signing_capacity.save!
      end

    # go through each SignatureEntity, if there are no descendants create a BlockCollection and Block
    # if there are descendants, update the ancestry
      signature_entity.descendants.each do |descendant|
        ancestry_array = descendant.ancestry.split('/')
        if ancestry_array.length == 1
          descendant.ancestry = nil
          descendant_block_collection = signature_group.block_collections.create

          descendant_block = descendant_block_collection.blocks.new(position: 1)

          descendant_block.signature_entity = descendant
          descendant_block.save
        else
          ancestry_array.shift
          new_ancestry      = ancestry_array.join('/')
          descendant.ancestry = new_ancestry
        end
        descendant.save
      end
    end

  end
end
