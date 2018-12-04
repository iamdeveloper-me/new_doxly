class CreateVotingInterestThresholds < ActiveRecord::Migration
  def change
    create_table :voting_interest_thresholds do |t|
      t.references :document, references: :tree_elements
      t.references :voting_interest_group, index: true, foreign_key: { on_delete: :cascade }
      t.float :threshold, null: false

      t.timestamps null: false
    end

    add_index :voting_interest_thresholds, :document_id
    add_foreign_key :voting_interest_thresholds, :tree_elements, column: :document_id, on_delete: :cascade
  end
end
