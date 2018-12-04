class AddTextValueToQuestionAnswer < ActiveRecord::Migration
  def change
    add_column :question_answers, :text_value, :string
  end
end
