class RemoveAssigneeAndStatusFromModels < ActiveRecord::Migration
  def change
    remove_columns :tasks, :deal_collaborator_id, :status
    remove_column  :folders, :status
    remove_column  :deal_documents, :status
  end
end
