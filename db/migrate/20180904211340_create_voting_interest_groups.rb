class CreateVotingInterestGroups < ActiveRecord::Migration
  def change
    create_table :voting_interest_groups do |t|
      t.string :name, null: false
      t.references :deal, index: true, foreign_key: { on_delete: :cascade }
      t.integer :total_number_of_shares, null: false

      t.timestamps null: false
    end
  end
end
