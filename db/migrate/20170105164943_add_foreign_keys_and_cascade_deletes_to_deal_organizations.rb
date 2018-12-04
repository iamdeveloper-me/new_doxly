class AddForeignKeysAndCascadeDeletesToDealOrganizations < ActiveRecord::Migration
  def change
    add_foreign_key :deal_organizations, :deals, on_delete: :cascade
    add_foreign_key :deal_organizations, :organizations, on_delete: :cascade
  end
end
