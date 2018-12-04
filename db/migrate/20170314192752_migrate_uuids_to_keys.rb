class MigrateUuidsToKeys < ActiveRecord::Migration
  def change
    signature_pages_table = Arel::Table.new(:signature_pages)
    signature_pages_sql = signature_pages_table.project(Arel.sql("*")).to_sql
    signature_pages = ActiveRecord::Base.connection.execute(signature_pages_sql)
    signature_pages.each do |signature_page|
      # generate a new key
      is_unique_key = false
      current_key   = nil
      until is_unique_key
        current_key = (0..3).map{ (0..3).map{ rand(10) }.join("") }.join("-")
        # need to make sure it is unique across all signature pages
        is_unique_key = ActiveRecord::Base.connection.execute(signature_pages_table.where(signature_pages_table[:unique_key].eq(current_key)).project(Arel.sql("*")).to_sql).count == 0
      end

      # set the new key
      update_manager = Arel::UpdateManager.new signature_pages_table.engine
      update_manager.table signature_pages_table
      update_manager.set([
        [signature_pages_table[:unique_key], current_key]
      ]).where(signature_pages_table[:id].eq(signature_page['id']))

      # save the change
      ActiveRecord::Base.connection.execute update_manager.to_sql
    end
  end
end
