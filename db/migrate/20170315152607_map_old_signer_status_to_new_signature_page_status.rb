class MapOldSignerStatusToNewSignaturePageStatus < ActiveRecord::Migration
  def change

    statuses_map = HashWithIndifferentAccess.new(
      "unopened": "awaiting_signature",
      "decline": "declined",
      "signing_complete": "signed"
    )

    signature_pages_table = Arel::Table.new(:signature_pages)
    signature_pages_sql = signature_pages_table.project(Arel.sql("*")).to_sql
    signature_pages = ActiveRecord::Base.connection.execute(signature_pages_sql)
    signature_pages.each do |signature_page|
      # get new status
      new_status = statuses_map[signature_page['signature_status']] || signature_page['siganture_status'] || "not_sent"

      # set the new key
      update_manager = Arel::UpdateManager.new signature_pages_table.engine
      update_manager.table signature_pages_table
      update_manager.set([
        [signature_pages_table[:signature_status], new_status]
      ]).where(signature_pages_table[:id].eq(signature_page['id']))

      # save the change
      ActiveRecord::Base.connection.execute update_manager.to_sql
    end
  end
end
