class CreateUnmatchedSignatureUploadPages < ActiveRecord::Migration
  def change
    create_table :unmatched_signature_upload_pages do |t|
      t.integer    :page_number
      t.integer    :signature_page_id, index: true
      t.string     :status, index: true
      t.integer    :unmatched_signature_upload_id, index: { name: 'unmatched_signature_upload_pages_on_unmatched_uploads' }
      t.timestamps null: false
    end
  end
end
