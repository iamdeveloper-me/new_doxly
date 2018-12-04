class SetDealPlaceholderOnExistingDeals < ActiveRecord::Migration
  def change
    # get tables
    deals_table = Arel::Table.new(:deals)
    users_table = Arel::Table.new(:users)
    signature_group_users_table = Arel::Table.new(:signature_group_users)
    signature_groups_table = Arel::Table.new(:signature_groups)

    # get records from database
    users_with_placeholder_name_sql = users_table.where(users_table["first_name"].eq("[First Name]").and(users_table["last_name"].eq("[Last Name]"))).project(Arel.sql("*")).to_sql
    users_with_placeholder_name = ActiveRecord::Base.connection.execute(users_with_placeholder_name_sql)
    users_with_placeholder_name_ids = users_with_placeholder_name.map{ |user| user["id"] }
    deals_sql = deals_table.project(Arel.sql("*")).to_sql
    deals     = ActiveRecord::Base.connection.execute(deals_sql)
    signature_groups_sql = signature_groups_table.project(Arel.sql("*")).to_sql
    signature_groups     = ActiveRecord::Base.connection.execute(signature_groups_sql)

    deals.each do |deal|
      number_of_placeholder_signers = 0
      signature_group_ids_array = []
      already_used_user_ids = {}
      deal_signature_groups_sql = signature_groups_table.where(signature_groups_table["deal_id"].eq(deal["id"])).project(Arel.sql("*")).to_sql
      deal_signature_groups = ActiveRecord::Base.connection.execute(deal_signature_groups_sql)
      deal_signature_groups.each do |deal_signature_group|
        signature_group_ids = signature_groups.select{ |signature_group| signature_group["ancestry"]&.split("/")&.include?(deal_signature_group["id"]) }.map{ |signature_group| signature_group["id"] }
        if !signature_group_ids.empty?
          signature_group_ids_array  << signature_group_ids
        end
        signature_group_ids_array << deal_signature_group["id"]
      end
      signature_group_ids_array = signature_group_ids_array.flatten.uniq
      if signature_group_ids_array.any?
        signature_group_users_sql = signature_group_users_table.where(signature_group_users_table["signature_group_id"].in(signature_group_ids_array).and(signature_group_users_table["user_id"].in(users_with_placeholder_name_ids))).project(Arel.sql("*")).to_sql
        signature_group_users = ActiveRecord::Base.connection.execute(signature_group_users_sql)

        signature_group_users.each do |signature_group_user|
          if already_used_user_ids[signature_group_user["user_id"]].present?
            signature_group_users_update_manager = Arel::UpdateManager.new signature_group_users_table.engine
            signature_group_users_update_manager.table signature_group_users_table
            signature_group_users_update_manager.set([
              [signature_group_users_table[:placeholder_id], already_used_user_ids[signature_group_user["user_id"]]]
              ]).where(signature_group_users_table[:id].eq(signature_group_user["id"]))
            ActiveRecord::Base.connection.execute signature_group_users_update_manager.to_sql
          else
            number_of_placeholder_signers += 1
            signature_group_users_update_manager = Arel::UpdateManager.new signature_group_users_table.engine
            signature_group_users_update_manager.table signature_group_users_table
            signature_group_users_update_manager.set([
              [signature_group_users_table[:placeholder_id], number_of_placeholder_signers
              ]]).where(signature_group_users_table[:id].eq(signature_group_user["id"]))
            ActiveRecord::Base.connection.execute signature_group_users_update_manager.to_sql
            already_used_user_ids[signature_group_user["user_id"]] = number_of_placeholder_signers
          end
        end
        if number_of_placeholder_signers > 0
          deals_update_manager = Arel::UpdateManager.new deals_table.engine
          deals_update_manager.table deals_table
          deals_update_manager.set([
            [deals_table[:number_of_placeholder_signers], number_of_placeholder_signers]]).where(deals_table[:id].eq(deal["id"]))
          ActiveRecord::Base.connection.execute deals_update_manager.to_sql
        end
      end
    end
  end
end
