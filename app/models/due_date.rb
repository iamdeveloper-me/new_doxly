class DueDate < ActiveRecord::Base
  belongs_to :due_dateable, polymorphic: true
  belongs_to :entity
  has_many :reminders, -> { order(:value) }, dependent: :destroy
  validates :entity, :due_dateable, :value, presence: true

  after_save :update_reminders

  def update_reminders
    reminders.each do |reminder|
      reminder.job.destroy if reminder.job.present?
      reminder.create_delayed_job
    end
  end
end
