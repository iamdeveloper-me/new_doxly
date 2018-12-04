class CreateRolesTable < ActiveRecord::Migration
  def change
    create_table :roles do |t|
      t.string :name
      t.references :roleable, polymorphic: true, index: true

      t.timestamps null: false
    end
  end
end
