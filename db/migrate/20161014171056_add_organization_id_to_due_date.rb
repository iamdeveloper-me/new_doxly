class AddOrganizationIdToDueDate < ActiveRecord::Migration
  def change
    add_column :due_dates, :organization_id, :integer

    add_foreign_key :due_dates, :organizations, on_delete: :cascade
  end
end
