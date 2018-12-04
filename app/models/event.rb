class Event < ActiveRecord::Base
  ACTIONS = ['NOTE_ADDED',
             'DOCUMENT_SIGNED',
             'DOCUMENT_CREATED',
             'DOCUMENT_UPDATED',
             'DOCUMENT_DELETED',
             'COLLABORATOR_INVITED',
             'COLLABORATOR_ACCEPTED',
             'TASK_COMPLETED',
             'DEAL_CLOSED',
             'DEAL_REOPENED',
             'DEAL_ARCHIVED',
             'DEAL_UNARCHIVED']

  HEADINGS = {
    'NOTE_ADDED' => "Note Added",
    'DOCUMENT_SIGNED' => "Document Signed",
    'DOCUMENT_CREATED' => "Document Uploaded",
    'DOCUMENT_UPDATED' => "New Document Version Uploaded",
    'DOCUMENT_DELETED' => "Document Deleted",
    'COLLABORATOR_INVITED' => "Collaborator Invited",
    'COLLABORATOR_ACCEPTED' => "Collaborator Added",
    'TASK_COMPLETED' => "Task Completed",
    'DEAL_CLOSED' => "Deal Closed",
    'DEAL_REOPENED' => "Deal Reopened",
    'DEAL_ARCHIVED' => "Deal Archived",
    'DEAL_UNARCHIVED' => "Deal Unarchived"
  }

  belongs_to :entity
  belongs_to :entity_user
  belongs_to :eventable,    :polymorphic => true
  belongs_to :associatable, :polymorphic => true

  scope :events_for, (lambda do |modules|
    where('module = ?', Array(modules)).order('created_at DESC')
  end)
  scope :allowed_digest_events, -> { where(:action => ['NOTE_ADDED', 'DOCUMENT_UPDATED', 'TASK_COMPLETED']) }

  def title
    HEADINGS[self.action]
  end

  def date
    self.created_at.strftime("%-m/%d/%Y")
  end

end
