class AddDateValueToQuestionAnswers < ActiveRecord::Migration
  def change
    add_column :question_answers, :date_value, :date
  end
end
