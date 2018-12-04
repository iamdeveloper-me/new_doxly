class QuestionResponse < ActiveRecord::Base
  belongs_to :question
  belongs_to :deal
  belongs_to :deal_entity_user
  has_many   :question_answers,   :dependent => :destroy, :inverse_of => :question_response, :autosave => true

  accepts_nested_attributes_for :question_answers

  validates :question_id, :deal_id, :deal_entity_user, presence: true
end
