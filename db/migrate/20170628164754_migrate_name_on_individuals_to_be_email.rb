class MigrateNameOnIndividualsToBeEmail < ActiveRecord::Migration
  def change
    Individual.all.each do |individual|
      email = individual.entity_users.includes(:user).first.user.email
      individual.name = email
      individual.save!
    end
  end
end
