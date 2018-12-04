class AddDealDocumentIdToTasks < ActiveRecord::Migration
  def change
    add_column :tasks, :deal_document_id, :integer

    add_index :tasks, :deal_document_id
  end
end
