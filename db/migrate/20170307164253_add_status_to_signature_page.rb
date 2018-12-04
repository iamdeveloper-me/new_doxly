class AddStatusToSignaturePage < ActiveRecord::Migration
  def change
    change_table :signature_pages do |t|
      t.string    :signature_status
      t.datetime  :signature_status_timestamp
      t.string    :file_id
      t.string    :url
      t.string    :download_url
      t.integer   :file_size
      t.string    :file_type
      t.rename    :unique_hash, :unique_key
    end

    change_table :signature_packets do |t|
      t.datetime  :sent_at
      t.datetime  :completed_at
      t.string    :docusign_envelope_id
      t.datetime  :reminder_email_timestamp
    end
  end
end
