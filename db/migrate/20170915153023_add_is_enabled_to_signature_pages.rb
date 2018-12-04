# This was added after #update_executed_signature_pages, but, had to be moved to an earlier time due to migration issues
class AddIsEnabledToSignaturePages < ActiveRecord::Migration
  def change
    add_column :signature_pages, :is_enabled, :boolean, default: true
  end
end
