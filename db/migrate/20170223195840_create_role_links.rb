class CreateRoleLinks < ActiveRecord::Migration
  def change
    create_table :role_links do |t|
      t.references :role_linkable, polymorphic: true, index: true
      t.references :role, index: true

      t.timestamps null: false
    end
  end
end
