class RenameDealCollaboratorsToDealOrganizationUsers < ActiveRecord::Migration
  def change
    rename_table :deal_collaborators, :deal_organization_users
  end
end
