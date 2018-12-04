class ExecuteDocumentsJob < ApplicationJob
  queue_as :execute_documents

  def perform(documents_hash, current_deal_entity_user)
    documents_hash.each do |document_hash|
      ExecuteDocumentJob.perform_later(document_hash, current_deal_entity_user)
    end
  end
end
