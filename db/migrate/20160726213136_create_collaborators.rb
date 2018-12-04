class CreateCollaborators < ActiveRecord::Migration
  def change
    create_table :collaborators do |t|
      t.integer :from_organization_id
      t.integer :to_organization_id
      t.boolean :is_active

      t.timestamps
    end
    add_index :collaborators, :from_organization_id
    add_index :collaborators, :to_organization_id
    add_index :collaborators, :is_active
  end
end
