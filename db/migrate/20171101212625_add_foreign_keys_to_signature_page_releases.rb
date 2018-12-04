class AddForeignKeysToSignaturePageReleases < ActiveRecord::Migration
  def change
    add_foreign_key :signature_page_executions, :versions, on_delete: :cascade
    add_foreign_key :signature_page_executions, :signature_pages, on_delete: :cascade
  end
end
