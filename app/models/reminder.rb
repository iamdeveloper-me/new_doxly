class Reminder < ActiveRecord::Base
  include Models::ScheduledJobs

  attr_accessor :time

  UNITS ={
   :minute => "Minute",
   :hour => "Hour",
   :day => "Day",
   :week => "Week",
   :month => "Month"
  }

  TIMES ={
   :before => "Before",
   :after => "After"
  }

  belongs_to :due_date
  belongs_to :entity_user
  validates :entity_user, :due_date, :value, presence: true
  validates :unit, presence: true, inclusion: { in: ['minute', 'hour', 'day', 'week', 'month'] }

  after_create :create_delayed_job

  def create_delayed_job
    # calculate difference
    difference = value.send("#{unit}s".to_sym)

    # create delayed job
    reminder_time = due_date.value + difference
  
    if reminder_time > Time.now
      reminder_job = ReminderJob.set(wait_until: reminder_time)
      reminder_job.perform_later(self)
      job_id = Delayed::Job.where("handler LIKE '%gid://doxly/Reminder/#{id}%'").first&.id
      self.build_scheduled_job :job_id => job_id if job_id.present?
    end

    # if unable to create delayed job, remove reminder
    if job_id.blank?
      self.destroy
      return false
    end

    self.save
  end
end
