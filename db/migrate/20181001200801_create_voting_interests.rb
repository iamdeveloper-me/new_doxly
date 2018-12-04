class CreateVotingInterests < ActiveRecord::Migration
  def change
    create_table :voting_interests do |t|
      t.float :number_of_shares, null: false
      t.references :block, index: true, foreign_key: { on_delete: :cascade }
      t.references :voting_interest_group, index: true, foreign_key: { on_delete: :cascade }

      t.timestamps null: false
    end
  end
end
