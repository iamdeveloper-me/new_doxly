class ClosingBookDocumentSerializer < ApplicationSerializer
  attributes :id, :name, :tab_number, :document_id, :created_at, :updated_at

  belongs_to :document
  has_many   :critical_errors
end
