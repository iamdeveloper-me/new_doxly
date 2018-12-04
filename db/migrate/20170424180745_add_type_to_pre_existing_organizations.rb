class AddTypeToPreExistingOrganizations < ActiveRecord::Migration
  def change
    Entity.all.each do |entity|
      if /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/.match(entity.name)
        entity.type = "Individual"
      else
        entity.type = "Organization"
      end
      entity.save
    end
  end
end
