class CreateQuestionResponses < ActiveRecord::Migration
  def change
    create_table :question_responses do |t|
      t.references :question, index: true
      t.references :deal, index: true
      t.references :deal_collaborator, index: true

      t.timestamps null: false
    end

    add_foreign_key :question_responses, :questions, on_delete: :cascade
    add_foreign_key :question_responses, :deals, on_delete: :cascade
    add_foreign_key :question_responses, :deal_collaborators, on_delete: :cascade
  end
end
