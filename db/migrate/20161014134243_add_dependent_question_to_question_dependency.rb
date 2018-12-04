class AddDependentQuestionToQuestionDependency < ActiveRecord::Migration
  def change
    add_reference :question_dependencies, :dependent_question, references: :questions, index: true
    add_foreign_key :question_dependencies, :questions, column: :dependent_question_id, on_delete: :cascade
  end
end
