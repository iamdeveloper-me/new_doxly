class MigrateAssignmentStatusStuffToCompletion < ActiveRecord::Migration
  def change
    assignment_statuses_table = Arel::Table.new(:assignment_statuses)
    assignment_statuses_sql = assignment_statuses_table.project(Arel.sql("*")).to_sql
    assignment_statuses = ActiveRecord::Base.connection.execute(assignment_statuses_sql)

    deal_organizations_table = Arel::Table.new(:deal_organizations)
    deal_organizations_sql = deal_organizations_table.project(Arel.sql("*")).to_sql
    deal_organizations = ActiveRecord::Base.connection.execute(deal_organizations_sql)

    completion_statuses_table = Arel::Table.new(:completion_statuses)

    puts "Loaded assignment_status table from Arel"
    assignment_statuses.each do |assignment_status|
      # weed out assignment_statuses that are only assignments to people
      next unless assignment_status['incompleted_at'].present? || assignment_status['completed_at'].present?
      puts "assignment_status ##{assignment_status['id']}"
      deal = TreeElement.find(assignment_status['assignable_id']).root.owner
      puts "found deal"


      deal_organization = deal_organizations.select{|deal_organization| deal_organization["organization_id"] == assignment_status['organization_id'] && deal_organization["deal_id"] == deal.id.to_s}.first
      # deal_organization can be nil and ["id"] will break that
      deal_organization_id = deal_organization["id"].to_i if deal_organization
      # because we're not dependent destroying assignment statuses
      # AND I'm making completion_status belong to deal_organization instead of organization,
      # It's possible that deal_organization_id could be nil
      next unless deal_organization_id
      puts "found deal_organization"
      is_complete = assignment_status['completed_at'].present?

      insert_manager = Arel::InsertManager.new completion_statuses_table.engine
      insert_manager.insert [
        [completion_statuses_table["is_complete"], is_complete],
        [completion_statuses_table["deal_organization_id"], deal_organization_id],
        [completion_statuses_table["tree_element_id"], assignment_status['assignable_id']],
        [completion_statuses_table["created_at"], assignment_status['created_at']],
        [completion_statuses_table["updated_at"], assignment_status['updated_at']]
      ]
      ActiveRecord::Base.connection.execute insert_manager.to_sql
      puts 'created CompletionStatus'
    end
  end
end
