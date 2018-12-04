module Models::ScheduledJobs

  def self.included(base)
    base.class_eval do
      has_one :scheduled_job, :as => :schedulable, :dependent => :destroy, :autosave => true
      has_one :job, :through => :scheduled_job
    end
  end

  def update_progress_current(step)
    self.job.update_column(:progress_current, self.job.progress_current + step)
  end

  def set_progress_current(total)
    self.job.update_column(:progress_current, total)
  end

end