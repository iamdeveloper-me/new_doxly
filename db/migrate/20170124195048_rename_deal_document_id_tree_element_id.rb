class RenameDealDocumentIdTreeElementId < ActiveRecord::Migration
  def change
    rename_column :closing_book_documents, :deal_document_id, :tree_element_id
  end
end
