class CreateUnmatchedSignatureUploads < ActiveRecord::Migration
  def change
    create_table :unmatched_signature_uploads do |t|
      t.string      :file_name, :null => false
      t.integer     :uploader_id, index: true
      t.timestamps  null: false
    end
  end
end
