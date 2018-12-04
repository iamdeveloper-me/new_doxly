Delayed::Worker.destroy_failed_jobs     = false
Delayed::Worker.sleep_delay             = 1
Delayed::Worker.max_attempts            = 5
Delayed::Worker.max_run_time            = 15.minutes
Delayed::Worker.read_ahead              = 1
Delayed::Worker.delay_jobs              = !Rails.env.test?
Delayed::Worker.default_queue_name      = "default"
ActiveRecord::Base.logger.level         = 1 unless Rails.env.development?
if Rails.env.development?
  Delayed::Worker.logger = Logger.new(STDOUT)
else
  Delayed::Worker.logger = Logger.new("log/#{Rails.env}_delayed_job.log", max_log_files = 5, split_log_at = 25.megabytes)
end

# Switch the AR Logger if we're in a DJ process or a DJ rake task.
if (caller.last =~ /script\/delayed_job/) || (File.basename($0) == "rake" && ARGV[0] =~ /jobs\:work/)
  ActiveRecord::Base.logger = Delayed::Worker.logger
end
