class MigrateEsignatureNotifications < ActiveRecord::Migration
  def change
    remove_column :esignature_notifications, :tree_element_id, :string

    # remove empty esignature_notifications
    esignature_notifications_table = Arel::Table.new(:esignature_notifications)
    esignature_notifications_sql = esignature_notifications_table.project(Arel.sql("*")).to_sql
    esignature_notifications = ActiveRecord::Base.connection.execute(esignature_notifications_sql)
    esignature_notifications.each do |esignature_notification|

      if esignature_notification['signature_packet_id'] == nil
        delete_manager = Arel::DeleteManager.new(ActiveRecord::Base)
        delete_manager.from(esignature_notifications_table).where(esignature_notifications_table[:id].eq(esignature_notification['id']))
        ActiveRecord::Base.connection.execute delete_manager.to_sql
      end
    end
  end
end
