class CreateAdfsSsoSettings < ActiveRecord::Migration
  def change
    create_table :adfs_sso_settings do |t|
      t.string :issuer_name, null: false, default: nil
      t.string :issuer, null: false, default: nil
      t.string :realm, null: false, default: nil
      t.string :reply, null: false, default: nil
      t.string :saml_version, null: false, default: "1"
      t.string :id_claim, null: false, default: nil
      t.string :idp_cert, null: false, default: nil
      t.string :logout_url, null: true

      t.timestamps  null: false
    end
  end
end
