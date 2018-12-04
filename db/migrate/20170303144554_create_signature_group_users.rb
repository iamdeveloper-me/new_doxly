class CreateSignatureGroupUsers < ActiveRecord::Migration
  def change
    create_table :signature_group_users do |t|
      t.references :signature_group, index: true
      t.references :user, index: true
      t.string :title

      t.timestamps null: false
    end
  end
end
