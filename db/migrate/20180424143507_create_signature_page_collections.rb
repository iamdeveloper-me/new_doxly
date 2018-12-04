class CreateSignaturePageCollections < ActiveRecord::Migration
  def change
    create_table :signature_page_collections do |t|
      t.references :tree_element_signature_group, index: { name: 'signature_page_collections_on_tree_element_signature_group' }, foreign_key: true

      t.timestamps null: false
    end
  end
end
