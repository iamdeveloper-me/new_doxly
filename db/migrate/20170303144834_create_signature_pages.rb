class CreateSignaturePages < ActiveRecord::Migration
  def change
    create_table :signature_pages do |t|
      t.references :signature_group_user, index: true
      t.references :tree_element, index: true
      t.string :unique_hash, index: true

      t.timestamps null: false
    end
  end
end
