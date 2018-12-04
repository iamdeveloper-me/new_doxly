class AddForeignKeysForCompletionStatus < ActiveRecord::Migration
  def change
    add_foreign_key :completion_statuses, :deal_organizations, on_delete: :cascade
    add_foreign_key :completion_statuses, :tree_elements, on_delete: :cascade
  end
end
