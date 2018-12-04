class AddMissingIndexes < ActiveRecord::Migration
  def change
    add_index :entity_users, :email_digest_preference
    add_index :entities, :type
    add_index :signature_pages, :is_custom
    add_index :signature_pages, :packet_page_number
    add_index :signature_pages, :is_enabled
    add_index :signature_pages, :is_executing
    add_index :versions, :executed_against_version_id
    add_index :versions, :sending_to_dms_status
    add_index :closing_books, :creator_id
    add_index :addresses, :type
    add_index :unmatched_signature_uploads, :deal_id
    add_index :aws_files, :expiration_datetime
    add_index :aws_files, :has_expiration_datetime
    add_index :signature_page_collections, :unique_key
    add_index :signature_packets, :packet_type
  end
end
