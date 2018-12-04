class VotingInterestGroupSerializer < ApplicationSerializer

  attributes :id, :name, :total_number_of_shares

  belongs_to :deal
  has_many :voting_interest_thresholds

end
