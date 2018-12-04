class UpdateProgressMaxDefaultOnDelayedJobs < ActiveRecord::Migration
  def change
    change_column_default :delayed_jobs, :progress_max, 100
  end
end
