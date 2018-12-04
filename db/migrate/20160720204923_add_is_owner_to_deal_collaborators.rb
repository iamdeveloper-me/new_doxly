class AddIsOwnerToDealCollaborators < ActiveRecord::Migration
  def change
    add_column :deal_collaborators, :is_owner, :boolean, :null => false, :default => false
  end
end
