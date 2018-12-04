class DeleteIsOwnerFromEntityUser < ActiveRecord::Migration
  def change
    remove_column :entity_users, :is_owner
  end
end
