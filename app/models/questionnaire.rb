class Questionnaire < ActiveRecord::Base
  belongs_to :deal_type
  has_many   :questions,  :dependent => :destroy

  validates_presence_of :deal_type_id
end
