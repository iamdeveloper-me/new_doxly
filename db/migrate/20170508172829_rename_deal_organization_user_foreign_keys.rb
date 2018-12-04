class RenameDealOrganizationUserForeignKeys < ActiveRecord::Migration
  def change
    rename_column :responsible_parties, :deal_organization_user_id, :deal_entity_user_id
    rename_column :question_responses, :deal_organization_user_id, :deal_entity_user_id
  end
end
