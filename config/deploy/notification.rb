require 'slack-notifier'

def notifier
  team  = fetch :slack_url

  @notifier ||= Slack::Notifier.new slack_url
end

Capistrano::Configuration.instance(:must_exist).load do |config|
  namespace :notify do
    desc 'Alert developers of a deploy'
    task :start_deploy do
      if fetch(:notify_deploy, true)
        begin
          @deploy_start = Time.now.utc
          branch_name = fetch(:branch_name, "master")

          local_user = ENV['USER'] || ENV['USERNAME']

          message = %Q[#{local_user} deploying #{branch_name} to #{stage}\ncap #{ARGV.join(' ')}]

          notifier.ping(message)
        rescue
          puts "Notifying Slack failed: #{$!}"
        end
      end
    end

    task :finish_deploy do
      if fetch(:notify_deploy, true)
        begin
          duration = (Time.now.utc - @deploy_start.to_i).to_i
          minutes = duration / 60
          seconds = duration % 60
          time = ""
          time += "#{minutes}min " if minutes > 0
          time += "#{seconds}sec" if seconds > 0
          message = "deploy complete in #{time}"

          notifier.ping(message)
        rescue
          puts "Notifying Slack failed: #{$!}"
        end
      end
    end
  end
end
