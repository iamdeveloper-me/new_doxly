class VotingInterest < ActiveRecord::Base
  belongs_to :block, inverse_of: :voting_interests
  belongs_to :voting_interest_group

  validates_numericality_of :number_of_shares, greater_than: 0
  validates_presence_of :block, :voting_interest_group
  validates_uniqueness_of :block_id, { scope: :voting_interest_group_id, message: 'must have unique combination of block and voting interest group' }

  def is_signed?(document)
    block.is_signed_for_document?(document)
  end

end
