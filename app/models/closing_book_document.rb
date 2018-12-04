class ClosingBookDocument < ActiveRecord::Base
  belongs_to :document
  belongs_to :closing_book_section
  has_one    :attachment,      :through => :tree_element
  has_one    :closing_book,    :through => :closing_book_section
  has_many   :critical_errors, :as => :critical_errorable, :autosave => true, :inverse_of => :critical_errorable

  default_scope { order(tab_number: :asc) }
  validates_presence_of :document, :closing_book_section

  def create_critical_error(error_type, options={})
    self.critical_errors.new.save_new!(error_type, options)
  end
end
