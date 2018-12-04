class AddRolesToExistingDeals < ActiveRecord::Migration
  def change
    role_ids = {}

    i = 1
    deals_table = Arel::Table.new(:deals)
    deals_sql = deals_table.project(Arel.sql("*")).to_sql
    deals = ActiveRecord::Base.connection.execute(deals_sql)
    deals.each do |deal|
      # create roles
      counsel_role = Role.new(
        roleable_id: deal['id'],
        roleable_type: "Deal",
        name: "Counsel"
      )
      counsel_role.save

      client_role = Role.new(
        roleable_id: deal['id'],
        roleable_type: "Deal",
        name: "Client"
      )
      client_role.save

      # store ids
      role_ids[deal['id']] = [counsel_role.id, client_role.id]

      # provide user with status
      print "\tCreated roles for #{i} / #{deals.count} deals\r"; $stdout.flush
      i += 1
    end
    puts ""

    i = 1
    deal_organizations_table = Arel::Table.new(:deal_organizations)
    deal_organizations_sql = deal_organizations_table.project(Arel.sql("*")).to_sql
    deal_organizations = ActiveRecord::Base.connection.execute(deal_organizations_sql)
    deal_organizations.each do |deal_organization|
      # create new role entity to link role and organization
      role_link = RoleLink.new(
        role_linkable_id: deal_organization['id'],
        role_linkable_type: "DealOrganization",
        role_id: role_ids[deal_organization['deal_id']][deal_organization['is_client'] ? 1 : 0]
      )
      role_link.save

      # provide user with status
      print "\t#{i} / #{deal_organizations.count} deal organizations migrated\r"; $stdout.flush
      i += 1
    end
    puts ""
  end
end
