class CreateQuestionDependencies < ActiveRecord::Migration
  def change
    create_table :question_dependencies do |t|
      t.references :question, index: true
      t.references :question_option, index: true

      t.timestamps null: false
    end

    add_foreign_key :question_dependencies, :questions, on_delete: :cascade
    add_foreign_key :question_dependencies, :question_options, on_delete: :cascade
  end
end
