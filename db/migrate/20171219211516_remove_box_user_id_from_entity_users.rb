class RemoveBoxUserIdFromEntityUsers < ActiveRecord::Migration
  def change
    remove_column :entity_users, :box_user_id
  end
end
