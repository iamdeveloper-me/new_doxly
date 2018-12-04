class QuestionOption < ActiveRecord::Base  
  belongs_to :question
  has_many   :question_dependencies,  dependent: :destroy
  has_many   :dependent_questions, class_name: "QuestionDependency", dependent: :destroy

  validates :question, :label, presence: true

  acts_as_list scope: :question
end
