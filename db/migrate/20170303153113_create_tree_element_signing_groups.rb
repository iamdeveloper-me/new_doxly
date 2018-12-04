class CreateTreeElementSigningGroups < ActiveRecord::Migration
  def change
    create_table :tree_element_signature_groups do |t|
      t.references :signature_group, index: true
      t.references :tree_element, index: true
      t.string :alias

      t.timestamps null: false
    end
  end
end
