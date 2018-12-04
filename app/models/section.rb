class Section < TreeElement

  has_many   :closing_book_sections, dependent: :destroy

end
