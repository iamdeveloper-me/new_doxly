class CreateNetDocumentsVersionStorage < ActiveRecord::Migration
  def change
    create_table :net_documents_version_storages do |t|
      t.jsonb :nd_version_object, index: { using: :gin }

      t.timestamps  null: false
    end
  end
end
