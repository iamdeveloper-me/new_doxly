class AssignmentStatuses < ActiveRecord::Migration
  def change
    create_table :assignment_statuses do |t|
      t.integer :organization_id
      t.integer :from_deal_collaborator_id
      t.integer :to_deal_collaborator_id
      t.references :assignable, :polymorphic => true
      t.string :status, :default => 'incomplete'
      t.datetime :assigned_at
      t.datetime :completed_at
      t.datetime :incompleted_at
      t.integer :completed_by_organization_user_id
      t.integer :incompleted_by_organization_user_id
      t.integer :timespent, :limit => 8

      t.timestamps
    end

    add_index :assignment_statuses, :organization_id
    add_index :assignment_statuses, [:assignable_id, :assignable_type]
    add_index :assignment_statuses, :from_deal_collaborator_id
    add_index :assignment_statuses, :to_deal_collaborator_id
    add_index :assignment_statuses, :status
    add_index :assignment_statuses, :assigned_at
    add_index :assignment_statuses, :completed_at
  end
end
