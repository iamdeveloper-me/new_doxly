class AddHasVotingThresholdToDeal < ActiveRecord::Migration
  def change
    add_column :deals, :has_voting_threshold, :boolean, default: :false # set all existing to false
    change_column :deals, :has_voting_threshold, :boolean, default: :true # then change the default to true so all new deals will be true
  end
end
