class VotingInterestThreshold < ActiveRecord::Base
  belongs_to :document
  belongs_to :voting_interest_group

  validates_numericality_of :threshold, greater_than: 0, message: "must be greater than 0%"
  validates_numericality_of :threshold, less_than_or_equal_to: 1, message: "cannot be greater than 100%"
  validates_presence_of :document, :voting_interest_group
  validates_uniqueness_of :document_id, { scope: :voting_interest_group_id, message: 'must have unique combination of document and voting interest group' }

  def completed_voting_interests
    document.voting_interests.where(voting_interest_group_id: voting_interest_group.id).select{|voting_interest| voting_interest.is_signed?(document) }
  end

  def completed_shares
    completed_voting_interests.inject(0){|completed_shares, voting_interest| completed_shares + voting_interest.number_of_shares }
  end

  def completed
    return 0 if voting_interest_group.total_number_of_shares == 0
    completed_shares / voting_interest_group.total_number_of_shares
  end
  
  def is_met?
    completed_shares >= voting_interest_group.total_number_of_shares * threshold
  end
end
