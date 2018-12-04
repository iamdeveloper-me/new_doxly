class ToDo < ActiveRecord::Base
  include Models::DueDateable

  belongs_to :deal_entity
  belongs_to :deal_entity_user
  belongs_to :tree_element
  belongs_to :creator, class_name: "DealEntityUser"

  validates_presence_of :text, :deal_entity, :tree_element
  validate :deal_entity_user_is_restricted
  after_save :update_reminder

  scope :my_todos, (lambda do |deal_entity_user_id|
    where(:deal_entity_user_id => deal_entity_user_id)
  end)
  scope :team_todos, (lambda do |deal_entity_id|
    joins(creator: :deal_entity).where("deal_entities.id = ?", deal_entity_id)
  end)

  def update_reminder
    due_date = self.due_dates.first
    if due_date && due_date.reminders.any?
      due_date.reminders.destroy_all
    end
    if due_date && deal_entity_user
      reminder = due_date.reminders.new
      reminder.time = "before"
      reminder.value = "-1"
      reminder.unit = "day"
      reminder.entity_user_id = deal_entity_user.entity_user_id
      reminder.save
    end
  end

  def deal_entity_user_is_restricted
    if deal_entity_user && deal_entity_user.tree_element_restrictions.pluck(:tree_element_id).include?(tree_element.id)
      errors.add(:deal_entity_user, :is_restricted_and_cannot_be_added)
    end
  end
end
