class Document < TreeElement

  has_many   :closing_book_documents, dependent: :destroy
  has_many   :voting_interest_thresholds, dependent: :destroy
  has_many   :blocks, through: :tree_element_signature_groups
  has_many   :voting_interests, through: :blocks
  has_many   :voting_interest_groups, through: :voting_interest_thresholds

  def are_voting_interest_thresholds_complete?
    signature_pages.sent.count > 0 && voting_interest_thresholds.all?(&:is_met?)
  end

end
