class SetEmailPreferenceOnExistingDeals < ActiveRecord::Migration
  def change
    # get tables
    organization_users_table = Arel::Table.new(:organization_users)

    # get organization_users
    organization_users_sql = organization_users_table.project(Arel.sql("*")).to_sql
    organization_users = ActiveRecord::Base.connection.execute(organization_users_sql)

    organization_users.each do |ou|

      # set the email_digest_preference on the organization_user
      update_manager = Arel::UpdateManager.new organization_users_table.engine
      update_manager.table organization_users_table
      update_manager.set [
        [organization_users_table[:email_digest_preference], :short_burst]
      ]

      # save the change
      ActiveRecord::Base.connection.execute update_manager.to_sql
    end
  end
end
