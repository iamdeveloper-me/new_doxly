class RemoveBoxAttributesFromSignaturePages < ActiveRecord::Migration
  def change
    remove_column :signature_pages, :file_id
    remove_column :signature_pages, :url
    remove_column :signature_pages, :download_url
    remove_column :signature_pages, :signed_url
    remove_column :signature_pages, :signed_download_url
  end
end
