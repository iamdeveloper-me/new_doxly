class ClosingBookSection < ActiveRecord::Base

  belongs_to  :section
  belongs_to  :closing_book
  has_many    :closing_book_documents, inverse_of: :closing_book_section, autosave: true, dependent: :destroy

  default_scope { order(position: :asc) }
  validates_presence_of :section, :closing_book

  accepts_nested_attributes_for :closing_book_documents

end
