class MigrateCriticalErrors < ActiveRecord::Migration
  def change
    # get tables
    critical_errors_table = Arel::Table.new(:critical_errors)
    critical_errors_sql   = critical_errors_table.project(Arel.sql("*")).to_sql
    critical_errors       = ActiveRecord::Base.connection.execute(critical_errors_sql)

    critical_errors.each do |critical_error|
      update_manager = Arel::UpdateManager.new critical_errors_table.engine
      update_manager.table critical_errors_table
      update_manager.set([
        [critical_errors_table[:critical_errorable_id], critical_error["deal_id"]],
        [critical_errors_table[:critical_errorable_type], "Deal"]
        ]).where(critical_errors_table[:id].eq(critical_error["id"]))
      ActiveRecord::Base.connection.execute update_manager.to_sql
    end
  end
end
