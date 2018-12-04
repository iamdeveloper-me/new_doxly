class QuestionAnswer < ActiveRecord::Base

  belongs_to :question_response, :inverse_of => :question_answers
  has_one    :question_option

  validates_inclusion_of :type, :in => %w( ShortTextAnswer NumericAnswer OptionAnswer DateAnswer )

  def self.answer_class(question_type)
    answer_class_string = question_type.gsub 'Question', 'Answer'
    answer_class_string = 'OptionAnswer' if ['ChecklistAnswer', 'DropdownAnswer'].include?(answer_class_string)
    answer_class_string.constantize
  end

  def value
    raise("'value' method has to be overridden in #{self.class.name}")
  end
end
