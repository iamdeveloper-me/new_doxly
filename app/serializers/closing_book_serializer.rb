class ClosingBookSerializer < ApplicationSerializer
  attributes :id, :name, :description, :creator_id, :status, :url, :created_at, :updated_at, :format

  belongs_to :creator
  has_many   :closing_book_documents
  
end
