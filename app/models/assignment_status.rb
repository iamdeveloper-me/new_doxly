class AssignmentStatus < ActiveRecord::Base

  belongs_to :entity
  belongs_to :assignable,             :polymorphic => true, :inverse_of => :assignment_statuses
  belongs_to :assigner, :class_name => 'DealEntityUser', :foreign_key => :assigner_id
  belongs_to :assignee, :class_name => 'DealEntityUser', :foreign_key => :assignee_id

  validates_presence_of :entity_id
  validates_presence_of :assignable
  validate :validate_assigner
  validate :validate_assignee

  def set_assigner(assigner_id)
    self.assigner_id   = assigner_id
    self.assigned_at               = Time.now.utc
  end

  def remove_assignee
    self.assigner_id = nil
    self.assignee_id   = nil
    self.assigned_at               = nil
  end

  def complete!(entity_user_id)
    self.status                              = "complete"
    self.completed_by_entity_user_id         = entity_user_id
    self.completed_at                        = Time.now.utc
    self.incompleted_by_entity_user_id       = nil
    self.incompleted_at                      = nil
    self.save!
  end

  def incomplete!(entity_user_id)
    self.status                              = "incomplete"
    self.completed_by_entity_user_id         = nil
    self.completed_at                        = nil
    self.incompleted_by_entity_user_id       = entity_user_id
    self.incompleted_at                      = Time.now.utc
    self.save!
  end

  def complete?
    self.status == "complete"
  end

  def incomplete?
    self.status == "incomplete"
  end

  private

  def validate_assigner
    return true if self.assigner.nil? && self.assignee.nil?
  end

  def validate_assignee
    return true if self.assigner.nil? && self.assignee.nil?
  end
end
