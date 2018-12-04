class FixEmptyIndividualsAndInvidualDealEntities < ActiveRecord::Migration
  def change
    individual_deal_entities = DealEntity.all.select { |de| de.entity.is_a?(Individual) && de.deal_entity_users.empty? }

    individual_deal_entities.each do |individual_deal_entity|
      individual_entity = individual_deal_entity.entity
      if individual_entity
        name              = individual_entity.name
        puts "Entity Name: #{name}"

        entity_user = individual_entity.entity_users.first
        if entity_user.nil?
          user = User.where("(first_name::text || ' ' || last_name::text) = '#{name}'").first
          if user
            puts "Email: #{user.email}"
            entity_user = individual_entity.entity_users.new(user_id: user.id, email_digest_preference: 'daily_digest')
            entity_user.bypass_title_validation = true
            entity_user.save!
          end
        end

        if entity_user && entity_user.persisted?
          deal_entity_user = individual_deal_entity.deal_entity_users.find_or_create_by!(entity_user_id: entity_user.id, role: "client")
          puts "Deal Entity User: #{deal_entity_user.id}"
        else
          puts "No user found for deal_entity #{individual_deal_entity.id}"
        end
      else
        puts "No entity found for deal_entity #{individual_deal_entity.id}"
      end
      puts "======="
    end
  end
end
