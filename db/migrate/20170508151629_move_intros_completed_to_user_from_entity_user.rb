class MoveIntrosCompletedToUserFromEntityUser < ActiveRecord::Migration
  def change
    add_column :users, :intros_completed, :text, array: true, default: []
  end
end
