class AddReminderEmailTimestampToDealDocumentSigners < ActiveRecord::Migration
  def change
    add_column :deal_document_signers, :reminder_email_timestamp, :datetime
  end
end
