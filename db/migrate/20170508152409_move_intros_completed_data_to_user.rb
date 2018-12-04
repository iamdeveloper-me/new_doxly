class MoveIntrosCompletedDataToUser < ActiveRecord::Migration
  def change
    EntityUser.all.each do |entity_user|
      user = entity_user.user
      next if user.nil?
      user.intros_completed = entity_user.intros_completed
      user.bypass_password_validation = true
      user.save
    end
  end
end
