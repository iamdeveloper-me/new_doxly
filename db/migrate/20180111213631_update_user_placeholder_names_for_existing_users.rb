class UpdateUserPlaceholderNamesForExistingUsers < ActiveRecord::Migration
  def change
    users_table = Arel::Table.new(:users)

    users_with_placeholder_names_sql = users_table.where(users_table["first_name"].eq("[First Name]").and(users_table["last_name"].eq("[Last Name]"))).project(Arel.sql("*")).to_sql
    users_with_placeholder_names = ActiveRecord::Base.connection.execute(users_with_placeholder_names_sql)

    users_with_placeholder_names.each do |user|
      users_update_manager = Arel::UpdateManager.new users_table.engine
      users_update_manager.table users_table
      users_update_manager.set([
        [users_table[:first_name], "Unnamed"],
        [users_table[:last_name], "Signer"]
        ]).where(users_table[:id].eq(user["id"]))
      ActiveRecord::Base.connection.execute users_update_manager.to_sql
    end


  end
end
