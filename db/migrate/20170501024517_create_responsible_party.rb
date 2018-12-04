class CreateResponsibleParty < ActiveRecord::Migration
  def change
    create_table :responsible_parties do |t|
      t.references :deal_organization, index: true
      t.references :tree_element, index: true
      t.references :deal_organization_user, index: true
      t.boolean    :currently_responsible, index: true
      t.string     :text

      t.timestamps null: false
    end
  end
end
