class TurnTasksThatNeedSignatureIntoDocuments < ActiveRecord::Migration
  def change
    Task.where(signature_required: true).each do |task|
      task.type = "Document"
      task.save!
    end
  end
end
