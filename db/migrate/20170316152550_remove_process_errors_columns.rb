class RemoveProcessErrorsColumns < ActiveRecord::Migration
  def change
    remove_column :signature_packets, :processing_errors
    remove_column :signature_pages, :processing_errors
  end
end
