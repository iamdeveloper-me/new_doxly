class DealTypeTemplate < ActiveRecord::Base
  validates  :deal_type,  presence: true
  validates  :template,  presence: true

  belongs_to :deal_type
  belongs_to :template
end
