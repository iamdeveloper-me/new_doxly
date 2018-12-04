class MigrateEntityUserRole < ActiveRecord::Migration
  def change
    EntityUser.all.each do |entity_user|
      entity_user.role = "entity_admin" if entity_user.role == "organization_admin"
      entity_user.bypass_title_validation = true
      entity_user.save
    end
  end
end
