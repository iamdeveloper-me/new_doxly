class Question < ActiveRecord::Base
  belongs_to :questionnaire
  has_many   :question_options,       :dependent => :destroy
  has_many   :question_dependencies,  :dependent => :destroy
  has_many   :dependent_questions,    :class_name => 'QuestionDependency',  :dependent => :destroy
  has_many   :question_responses,     :dependent => :destroy

  validates_inclusion_of :type, :in => %w( ShortTextQuestion NumericQuestion DropdownQuestion ChecklistQuestion DateQuestion )
  validates_inclusion_of :unit_type, :in => %w( Currency Percent None )

  acts_as_list scope: :questionnaire
end
