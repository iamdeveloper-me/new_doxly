class VotingInterestThresholdSerializer < ApplicationSerializer

  attributes :id, :threshold, :voting_interest_group_id, :document_id

  belongs_to :document
  belongs_to :voting_interest_group

end
