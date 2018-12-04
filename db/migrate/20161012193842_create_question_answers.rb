class CreateQuestionAnswers < ActiveRecord::Migration
  def change
    create_table :question_answers do |t|
      t.references :question_response, index: true
      t.string :type
      t.integer :numeric_value
      t.integer :option_id
      t.string :other_option_value

      t.timestamps null: false
    end

    add_foreign_key :question_answers, :question_responses, on_delete: :cascade
  end
end
