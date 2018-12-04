class NewChecklist < ActiveRecord::Migration
  def change
    # create new tables
    create_table :tree_elements do |t|
      t.string    "name"
      t.text      "description"
      t.string    "type"
      t.integer   "owner_id"
      t.string    "owner_type"
      t.string    "ancestry"
      t.string    "signature_type"
      t.boolean   "is_post_closing", default: false, null: false
      t.datetime  "created_at"
      t.datetime  "updated_at"
    end
    add_index "tree_elements", [:ancestry, :owner_id]

    create_table :attachments do |t|
      t.integer   "tree_element_id"
      t.datetime  "created_at"
      t.datetime  "updated_at"
    end
    add_index "attachments", :tree_element_id

    create_table :versions do |t|
      t.integer   "attachment_id"
      t.string    "file_id"
      t.string    "url"
      t.string    "download_url"
      t.integer   "file_size"
      t.string    "file_type"
      t.integer   "organization_user_id"
      t.datetime  "created_at"
      t.datetime  "updated_at"
      t.boolean   "is_executed", default: false, null: false
      t.datetime  "is_executed_at"
    end
    add_index "versions", :attachment_id

    create_table :signature_envelopes do |t|
      t.integer   "tree_element_id"
      t.datetime  "signature_sent_at"
      t.datetime  "signature_executed_at"
      t.string    "signature_status"
      t.string    "docusign_envelope_id"
      t.datetime  "created_at"
      t.datetime  "updated_at"
    end
    add_index "signature_envelopes", :tree_element_id

    create_table :signers do |t|
      t.integer   "tree_element_id"
      t.integer   "deal_organization_user_id"
      t.datetime  "signature_completed_at"
      t.string    "signature_recipient_id"
      t.string    "signature_status"
      t.datetime  "created_at"
      t.datetime  "updated_at"
      t.datetime  "signature_status_timestamp"
      t.datetime  "reminder_email_timestamp"
    end
    add_index "signers", :tree_element_id

    remove_foreign_key "esignature_notifications", "deal_documents"
    rename_column :esignature_notifications, :deal_document_id, :tree_element_id
    #add_foreign_key "esignature_notifications", "tree_elements", column: "tree_element_id"
  end
end
