class AddForeignKeysToToDos < ActiveRecord::Migration
  def change
    add_foreign_key :to_dos, :tree_elements, on_delete: :cascade
    add_foreign_key :to_dos, :deal_organizations, on_delete: :cascade
    add_foreign_key :to_dos, :deal_organization_users
    add_foreign_key :to_dos, :deal_organization_users, column: :creator_id
  end
end
