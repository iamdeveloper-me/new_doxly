class ChangeTreeElementIdToSectionIdAndDocumentId < ActiveRecord::Migration
  def change
    rename_column :closing_book_sections, :tree_element_id, :section_id
    rename_column :closing_book_documents, :tree_element_id, :document_id
  end
end
