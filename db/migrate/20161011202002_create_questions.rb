class CreateQuestions < ActiveRecord::Migration
  def change
    create_table :questions do |t|
      t.references :questionnaire, index: true
      t.string :type
      t.string :field
      t.string :validation_regex
      t.string :validation_error_key

      t.timestamps null: false
    end

    add_foreign_key :questions, :questionnaires, on_delete: :cascade
  end
end
