class ChangeSignatureJobErrorsTable < ActiveRecord::Migration
  def change
    rename_table :signature_job_errors, :critical_errors

    rename_column :critical_errors, :error_message, :user_message
    change_table :critical_errors do |t|
      t.references :critical_errorable, polymorphic: true, index: { name: 'index_on_critical_errorable_type_and_critical_errorable_id' }
      t.text :error_message
      t.text :backtrace
    end
  end
end
