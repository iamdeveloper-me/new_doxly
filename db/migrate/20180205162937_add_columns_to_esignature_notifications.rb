class AddColumnsToEsignatureNotifications < ActiveRecord::Migration
  def change
    add_column :esignature_notifications, :status, :string, :default => 'sent', :null => false
    add_column :esignature_notifications, :docusign_posted, :boolean, :default => 'false', :null => false
    add_column :esignature_notifications, :is_processing, :boolean, :default => 'false', :null => false

    add_index :esignature_notifications, :status
    add_index :esignature_notifications, :docusign_posted
    add_index :esignature_notifications, :is_processing
  end
end
