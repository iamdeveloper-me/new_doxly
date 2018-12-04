class UpdateSignaturePageCollection < ActiveRecord::Migration
  def change
    # get the tables necessary to work with
    signature_groups_table = Arel::Table.new(:signature_groups)
    signature_groups_sql   = signature_groups_table.project(Arel.sql("*")).to_sql
    signature_groups       = ActiveRecord::Base.connection.execute(signature_groups_sql)

    block_collections_table                           = Arel::Table.new(:block_collections)
    blocks_table                                      = Arel::Table.new(:blocks)
    signing_capacities_table                          = Arel::Table.new(:signing_capacities)
    se_signing_capacities_table                       = Arel::Table.new(:signing_capacities)
    signature_entities_table                          = Arel::Table.new(:signature_entities)
    signature_pages_table                             = Arel::Table.new(:signature_pages)
    signature_page_collections_table                  = Arel::Table.new(:signature_page_collections)
    signature_packet_signature_page_collections_table = Arel::Table.new(:signature_packet_signature_page_collections)

    # go through each of the newly created, top level SignatureGroups
    signature_groups.each do |signature_group|
      block_collections_sql = block_collections_table.where(block_collections_table["signature_group_id"].eq(signature_group["id"])).project(Arel.sql("*")).to_sql
      block_collections     = ActiveRecord::Base.connection.execute(block_collections_sql)

      block_collections.each do |block_collection|
        blocks_sql = blocks_table.where(blocks_table["block_collection_id"].eq(block_collection["id"])).project(Arel.sql("*")).to_sql
        blocks     = ActiveRecord::Base.connection.execute(blocks_sql)
        # going through the signature group's block collections and blocks to get every signing capacity
        blocks.each do |block|
          signing_capacities_sql = signing_capacities_table.where(signing_capacities_table["block_id"].eq(block["id"])).project(Arel.sql("*")).to_sql
          signing_capacities     = ActiveRecord::Base.connection.execute(signing_capacities_sql)
          signature_entities_sql = signature_entities_table.where(signature_entities_table["block_id"].eq(block["id"])).project(Arel.sql("*")).to_sql
          signature_entities     = ActiveRecord::Base.connection.execute(signature_entities_sql)

          # if an entity has ancestry, find the last descendant to be able to find the right signing capacity
          signature_entities.each do |signature_entity|
            sig_entity = SignatureEntity.find(signature_entity["id"])
            signing_entity = sig_entity.descendants.present? ? sig_entity.last_descendant : signature_entity

            se_signing_capacities_sql = se_signing_capacities_table.where(se_signing_capacities_table["signature_entity_id"].eq(signing_entity["id"])).project(Arel.sql("*")).to_sql
            se_signing_capacities     = ActiveRecord::Base.connection.execute(se_signing_capacities_sql)

            se_signing_capacities.each do |signing_capacity|
              signature_pages_sql = signature_pages_table.where(signature_pages_table["signing_capacity_id"].eq(signing_capacity["id"])).project(Arel.sql("*")).to_sql
              signature_pages     = ActiveRecord::Base.connection.execute(signature_pages_sql)

              signature_pages.each do |signature_page|
                # create a new SignaturePageCollection object for every signature page
                insert_manager = Arel::InsertManager.new signature_page_collections_table.engine
                insert_manager.insert [
                  [signature_page_collections_table[:block_collection_id], block_collection["id"]],
                  [signature_page_collections_table[:tree_element_signature_group_id],signature_page["tree_element_signature_group_id"]],
                  [signature_page_collections_table[:created_at], signature_page["created_at"]],
                  [signature_page_collections_table[:updated_at], Time.now.utc]
                ]
                signature_page_collection_id = ActiveRecord::Base.connection.insert insert_manager.to_sql
                # update the SignaturePage and SignaturePacketSignaturePageCollection with the newly created SignaturePageCollection ID
                signature_pages_update_manager = Arel::UpdateManager.new signature_pages_table.engine
                signature_pages_update_manager.table signature_pages_table
                signature_pages_update_manager.set [
                  [signature_pages_table[:signature_page_collection_id], signature_page_collection_id]
                ]
                signature_pages_update_manager.where signature_pages_table[:id].eq signature_page['id']
                ActiveRecord::Base.connection.execute signature_pages_update_manager.to_sql

                signature_packet_signature_page_collections_update_manager = Arel::UpdateManager.new signature_packet_signature_page_collections_table.engine
                signature_packet_signature_page_collections_update_manager.table signature_packet_signature_page_collections_table
                signature_packet_signature_page_collections_update_manager.set [
                  [signature_packet_signature_page_collections_table[:signature_page_collection_id], signature_page_collection_id]
                ]
                signature_packet_signature_page_collections_update_manager.where signature_packet_signature_page_collections_table[:signature_page_id].eq signature_page["id"]
                ActiveRecord::Base.connection.execute signature_packet_signature_page_collections_update_manager.to_sql
              end
            end
          end

          signing_capacities.each do |signing_capacity|
            # going through the same iterations as above except for individual signers rather than entity signers
            signature_pages_sql = signature_pages_table.where(signature_pages_table["signing_capacity_id"].eq(signing_capacity["id"])).project(Arel.sql("*")).to_sql
            signature_pages     = ActiveRecord::Base.connection.execute(signature_pages_sql)

            signature_pages.each do |signature_page|
              insert_manager = Arel::InsertManager.new signature_page_collections_table.engine
              insert_manager.insert [
                [signature_page_collections_table[:block_collection_id], block_collection["id"]],
                [signature_page_collections_table[:tree_element_signature_group_id],signature_page["tree_element_signature_group_id"]],
                [signature_page_collections_table[:created_at], signature_page["created_at"]],
                [signature_page_collections_table[:updated_at], Time.now.utc]
              ]
              signature_page_collection_id = ActiveRecord::Base.connection.insert insert_manager.to_sql

              signature_pages_update_manager = Arel::UpdateManager.new signature_pages_table.engine
              signature_pages_update_manager.table signature_pages_table
              signature_pages_update_manager.set [
                [signature_pages_table[:signature_page_collection_id], signature_page_collection_id]
              ]
              signature_pages_update_manager.where signature_pages_table[:id].eq signature_page['id']
              ActiveRecord::Base.connection.execute signature_pages_update_manager.to_sql

              signature_packet_signature_page_collections_update_manager = Arel::UpdateManager.new signature_packet_signature_page_collections_table.engine
              signature_packet_signature_page_collections_update_manager.table signature_packet_signature_page_collections_table
              signature_packet_signature_page_collections_update_manager.set [
                [signature_packet_signature_page_collections_table[:signature_page_collection_id], signature_page_collection_id]
              ]
              signature_packet_signature_page_collections_update_manager.where signature_packet_signature_page_collections_table[:signature_page_id].eq signature_page["id"]
              ActiveRecord::Base.connection.execute signature_packet_signature_page_collections_update_manager.to_sql
            end
          end
        end
      end
    end
  end
end
