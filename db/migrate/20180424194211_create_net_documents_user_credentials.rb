class CreateNetDocumentsUserCredentials < ActiveRecord::Migration
  def change
    create_table :dms_user_credentials do |t|
      t.references :entity_user, index: true
      t.references :dms_user_credentialable, polymorphic: true, index: { name: 'index_dms_user_credentials_on_dms_user_credentialable' }

      t.timestamps  null: false
    end

    create_table :net_documents_user_credentials do |t|
      t.string :refresh_token
      t.string :access_token

      t.timestamps  null: false
    end
  end
end
