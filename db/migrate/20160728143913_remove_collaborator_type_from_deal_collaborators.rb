class RemoveCollaboratorTypeFromDealCollaborators < ActiveRecord::Migration
  def change
    remove_column :deal_collaborators, :collaborator_type
  end
end
