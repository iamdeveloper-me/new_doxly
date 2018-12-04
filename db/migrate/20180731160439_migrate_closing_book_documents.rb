class MigrateClosingBookDocuments < ActiveRecord::Migration
  def change
    ClosingBook.all.each do |closing_book|
      position = 1
      # create the closing book sections
      sections = closing_book.deal.closing_category.children
      sections.each do |section|
        # create new closing book section
        closing_book_section = ClosingBookSection.new
        closing_book_section.name = section.name
        closing_book_section.section = section
        closing_book_section.closing_book = closing_book
        closing_book_section.position = position

        # add it to the closing book
        closing_book.closing_book_sections << closing_book_section

        # increment position
        position += 1
      end

      # for each closing book document, copy the name and closing_book_id
      ClosingBookDocument.where(closing_book_id: closing_book.id).each do |closing_book_document|
        next unless closing_book_document.document.present?
        closing_book_document.name = closing_book_document.document.name
        closing_book_document.closing_book_section = closing_book.closing_book_sections.find_by(section_id: closing_book_document.document.ancestry.split('/')[1])
        closing_book_document.save!
      end

      # set tab numbers
      closing_book.reload
      tab_number = 1
      closing_book.closing_book_sections.each do |closing_book_section|
        closing_book_section.closing_book_documents.each do |closing_book_document|
          closing_book_document.tab_number = tab_number
          tab_number += 1
        end
      end

      # save
      closing_book.save!
    end
  end
end
