class AddForeignKeyToDealOrganizationUser < ActiveRecord::Migration
  def change
    add_foreign_key :deal_organization_users, :organization_users, on_delete: :cascade
  end
end
