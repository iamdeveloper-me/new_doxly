class MigrateEsignatureNotificationsStatus < ActiveRecord::Migration
  def change
    esignature_notifications_table          = Arel::Table.new(:esignature_notifications)
    signature_packets_table                 = Arel::Table.new(:signature_packets)
    signature_packet_signature_pages_table  = Arel::Table.new(:signature_packet_signature_pages)
    signature_pages_table                   = Arel::Table.new(:signature_pages)

    esignature_notifications_sql = esignature_notifications_table.project(Arel.sql("*")).to_sql
    esignature_notifications = ActiveRecord::Base.connection.execute(esignature_notifications_sql)
    esignature_notifications.each do |esignature_notification|
      signature_packet_id                  = esignature_notification['signature_packet_id']
      signature_packet_sql                 = signature_packets_table.where(signature_packets_table["id"].eq(signature_packet_id)).project(Arel.sql("*")).to_sql
      signature_packet                     = ActiveRecord::Base.connection.execute(signature_packet_sql).first

      if signature_packet["completed_at"].present?
        esignature_notifications_update_manager = Arel::UpdateManager.new esignature_notifications_table.engine
        esignature_notifications_update_manager.table esignature_notifications_table
        esignature_notifications_update_manager.set([
          [esignature_notifications_table[:docusign_posted], true],
          [esignature_notifications_table[:status], "received"]
          ]).where(esignature_notifications_table[:id].eq(esignature_notification["id"]))
        ActiveRecord::Base.connection.execute esignature_notifications_update_manager.to_sql
      elsif signature_packet["sent_at"].present?
        signature_packet_signature_pages_sql = signature_packet_signature_pages_table.where(signature_packet_signature_pages_table["signature_packet_id"].eq(signature_packet_id)).project(Arel.sql("signature_page_id")).to_sql
        signature_packet_signature_pages     = ActiveRecord::Base.connection.execute(signature_packet_signature_pages_sql)
        signature_page_ids_array             = signature_packet_signature_pages.map{ |signature_packet_signature_page| signature_packet_signature_page["signature_page_id"] }

        signature_pages_sql                  = signature_pages_table.where(signature_pages_table["id"].in(signature_page_ids_array)).project(Arel.sql("signature_status")).to_sql
        signature_pages                      = ActiveRecord::Base.connection.execute(signature_pages_sql)
        signature_page_statuses              = signature_pages.map{ |signature_page| signature_page["signature_status"] }
        # if all pages are signed, need to mark this as signed
        if signature_page_statuses.any? && signature_page_statuses.all?{ |status| status == "signed" }
          esignature_notifications_update_manager = Arel::UpdateManager.new esignature_notifications_table.engine
          esignature_notifications_update_manager.table esignature_notifications_table
          esignature_notifications_update_manager.set([
            [esignature_notifications_table[:status], "signed"]
            ]).where(esignature_notifications_table[:id].eq(esignature_notification["id"]))
          ActiveRecord::Base.connection.execute esignature_notifications_update_manager.to_sql
        end
      end
    end
  end
end
