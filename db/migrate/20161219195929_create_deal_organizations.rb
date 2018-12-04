class CreateDealOrganizations < ActiveRecord::Migration
  def change
    create_table :deal_organizations do |t|
      t.string :deal_id
      t.string :organization_id

      t.timestamps null: false
    end
  end
end
