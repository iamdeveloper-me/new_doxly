class AddForeignKeyToDealOrgUsersDealOrg < ActiveRecord::Migration
  def change
    add_foreign_key :deal_organization_users, :deal_organizations, on_delete: :cascade
  end
end
