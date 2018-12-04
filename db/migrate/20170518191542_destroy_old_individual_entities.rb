class DestroyOldIndividualEntities < ActiveRecord::Migration
  def change
    Individual.all.each do |individual_entity|
      if /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/.match(individual_entity.name)
        individual_entity.destroy
      end
    end
  end
end
