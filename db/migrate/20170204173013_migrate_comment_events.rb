class MigrateCommentEvents < ActiveRecord::Migration
  def change
    Event.where(:module => 'Comment').each do |event|
      event.module         = 'Note'
      event.eventable_type = 'Note'
      event.action         = 'NOTE_ADDED'
      event.save
    end
  end
end
