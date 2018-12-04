class ChangeUseSignatureDefaultInDealDocuments < ActiveRecord::Migration
  def change
    change_column_default :deal_documents, :use_signature, false
  end
end
