class VotingInterestSerializer < ApplicationSerializer

  attributes :id, :number_of_shares, :voting_interest_group_id, :block_id

  belongs_to :block
  belongs_to :voting_interest_group

end
