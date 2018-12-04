class CreateEsignatureNotifications < ActiveRecord::Migration
  def change
    create_table :esignature_notifications do |t|
      t.integer :deal_document_id, :null => false
      t.string :envelope_id, :null => false
      t.string :token, :null => false

      t.timestamps
    end

    add_index :esignature_notifications, :deal_document_id
    add_index :esignature_notifications, :envelope_id
    add_index :esignature_notifications, :token
    add_foreign_key(:esignature_notifications, :deal_documents, dependent: :delete)
  end
end
