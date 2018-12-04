class CreateToDos < ActiveRecord::Migration
  def change
    create_table :to_dos do |t|
      t.references :tree_element, index: true, null: false
      t.references :deal_organization, index: true, null: false
      t.references :deal_organization_user, index: true
      t.integer :creator_id, index: true, null: false
      t.datetime  :due_at
      t.boolean :is_complete, index: true, default: false
      t.string :text
      t.integer :position

      t.timestamps null: false

    end
  end
end
