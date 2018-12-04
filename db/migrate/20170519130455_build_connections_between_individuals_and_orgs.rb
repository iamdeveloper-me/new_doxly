class BuildConnectionsBetweenIndividualsAndOrgs < ActiveRecord::Migration
  def change
    Individual.all.each do |individual_entity|
      individual_entity.deals.each do |deal|

        # we can assume that the owner entity of a deal should be connected to everyone on a deal.
        owner_entity = deal.owner_entity
        # don't connect entities that are already connected
        next if individual_entity.connected_entities.include?(owner_entity) || owner_entity == individual_entity

        # build the first entity_connection
        entity_connection                               = individual_entity.entity_connections.new
        entity_connection.connected_entity              = owner_entity
        entity_connection.save


        unless owner_entity.connected_entities.include?(individual_entity)
          # build the second entity_connection
          reverse_entity_connection                     = owner_entity.entity_connections.new
          reverse_entity_connection.connected_entity    = individual_entity
          reverse_entity_connection.save
        end
      end
    end
  end
end
