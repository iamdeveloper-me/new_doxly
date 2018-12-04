class DocumentSerializer < TreeElementSerializer

  has_many  :closing_book_documents
  has_many  :voting_interest_thresholds

end
