class MoveRolesOntoDealIndividualsFromDealOrganizationUsers < ActiveRecord::Migration
  def change
    role_links_table = Arel::Table.new(:role_links)

    # get organization_users
    role_links_sql = role_links_table.project(Arel.sql("*")).to_sql
    role_links = ActiveRecord::Base.connection.execute(role_links_sql)
    role_links.each do |role_link|
      if role_link["role_linkable_type"] == "DealOrganizationUser"
        id = role_link["id"]

        # initialize the update_manager
        update_manager = Arel::UpdateManager.new role_links_table.engine
        update_manager.table role_links_table

        deal_entity_user = DealEntityUser.find_by(:id => role_link["role_linkable_id"])
        raise "Cannot find Role Linkable ID #{role_link["role_linkable_id"]}" unless deal_entity_user
        deal_entity = deal_entity_user.reload.deal_entity
        raise "Cannot find Entity for Entity User #{deal_entity_user.id}" unless deal_entity

        if deal_entity.entity.type == "Individual"
          individual_entity = Individual.find_or_create_by(name: deal_entity_user.name, is_counsel: false)
          deal_individual = individual_entity.deal_entities.create!(deal_id: deal_entity.deal_id, is_owner: false)

          # set the changes
          update_manager.set([
            [role_links_table["role_linkable_id"], deal_individual.id]
          ]).where(role_links_table["id"].eq(id))

        else
          # set the changes
          update_manager.set([
            [role_links_table["role_linkable_id"], deal_entity.id]
          ]).where(role_links_table["id"].eq(id))
        end

        # save the changes
        ActiveRecord::Base.connection.execute update_manager.to_sql
      end
    end
  
    # rename the columns to match the data above
    rename_column :role_links, :role_linkable_id, :deal_entity_id
    remove_column :role_links, :role_linkable_type
  end
end
