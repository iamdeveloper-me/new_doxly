class MigrateEntityUsersToHaveIsDefault < ActiveRecord::Migration
  def change
    User.all.each do |user|
      entity_user = user.entity_users.first
      next unless entity_user
      entity_user.is_default = true
      entity_user.bypass_title_validation = true
      entity_user.save!
    end
  end
end