class CreateSignatureJobErrors < ActiveRecord::Migration
  def change
    create_table :signature_job_errors do |t|
      t.references :deal, index: true
      t.string :error_type, :null => false
      t.string :error_message, :null => false
      t.boolean :is_read, :null => false, :default => false

      t.timestamps null: false
    end

    add_index :signature_job_errors, :error_type
    add_foreign_key :signature_job_errors, :deals, on_delete: :cascade
  end
end
