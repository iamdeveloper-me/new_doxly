class RenameDealCollaboratorIds < ActiveRecord::Migration
  def change
    rename_column :deal_document_signers, :deal_collaborator_id, :deal_organization_user_id
    rename_column :question_responses, :deal_collaborator_id, :deal_organization_user_id
  end
end
