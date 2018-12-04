class DealType < ActiveRecord::Base
  validates   :name,                  presence: true, length: { maximum: 100 }

  belongs_to  :entity
  has_many    :deal_type_templates,   :dependent => :destroy, :inverse_of => :deal_type
  has_one     :questionnaire,         :dependent => :destroy
  has_many    :roles, as: :roleable
end
