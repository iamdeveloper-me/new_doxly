class CreateSsoSettings < ActiveRecord::Migration
  def change
    create_table :sso_settings do |t|
      t.references :organizations, index: true
      t.string :idp_cert_fingerprint
      t.string :target_url
      t.string :logout_url

      t.timestamps null: false
    end
  end
end
