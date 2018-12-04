class AddFieldsToSignaturePagesAndSignaturePackets < ActiveRecord::Migration
  def change
    change_table :signature_pages do |t|
      t.integer   :signature_status_by_organization_user_id
      t.string    :signed_file_id
      t.string    :signed_url
      t.string    :signed_download_url
      t.integer   :signed_file_size
      t.string    :signed_file_type
      t.string    :processing_errors
    end

    change_table :signature_packets do |t|
      t.integer   :sent_by_organization_user_id
      t.string    :file_id
      t.string    :url
      t.string    :download_url
      t.integer   :file_size
      t.string    :file_type
      t.string    :signed_file_id
      t.string    :signed_url
      t.string    :signed_download_url
      t.integer   :signed_file_size
      t.string    :signed_file_type
    end
  end
end
