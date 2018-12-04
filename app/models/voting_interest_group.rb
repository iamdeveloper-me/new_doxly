class VotingInterestGroup < ActiveRecord::Base

  belongs_to :deal
  has_many :voting_interest_thresholds, dependent: :destroy
  has_many :voting_interests,           dependent: :destroy

  validates :name, presence: true
  validates_numericality_of :total_number_of_shares, greater_than_or_equal_to: 0, less_than_or_equal_to: 10000000000

end