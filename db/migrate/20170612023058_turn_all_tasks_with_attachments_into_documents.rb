class TurnAllTasksWithAttachmentsIntoDocuments < ActiveRecord::Migration
  def change
    Task.joins(:attachment).each do |task|
      task.type = "Document"
      task.save!
    end
  end
end
