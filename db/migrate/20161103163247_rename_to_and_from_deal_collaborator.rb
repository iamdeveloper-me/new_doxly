class RenameToAndFromDealCollaborator < ActiveRecord::Migration
  def change
    rename_column :assignment_statuses, :to_deal_collaborator_id, :assignee_id
    rename_column :assignment_statuses, :from_deal_collaborator_id, :assigner_id
  end
end
