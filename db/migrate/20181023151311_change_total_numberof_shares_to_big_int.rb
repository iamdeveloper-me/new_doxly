class ChangeTotalNumberofSharesToBigInt < ActiveRecord::Migration
  def change
    change_column :voting_interest_groups, :total_number_of_shares, :bigint
  end
end
