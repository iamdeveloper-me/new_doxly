class QuestionDependency < ActiveRecord::Base
  belongs_to :question
  belongs_to :dependent_question, :class_name => "Question", dependent: :destroy
  belongs_to :question_option
end
