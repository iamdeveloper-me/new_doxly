class RenameDealOrganizationUserToDealEntityUser < ActiveRecord::Migration
  def change
    rename_table :deal_organization_users, :deal_entity_users
  end
end
