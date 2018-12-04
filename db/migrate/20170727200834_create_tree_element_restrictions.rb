class CreateTreeElementRestrictions < ActiveRecord::Migration
  def change
    create_table :tree_element_restrictions do |t|
      t.references :tree_element, index: true
      t.references :restrictable, polymorphic: true, index: { name: 'index_on_restrictable_id_and_restrictable_type' }
    end

    add_foreign_key :tree_element_restrictions, :tree_elements, on_delete: :cascade
  end
end
