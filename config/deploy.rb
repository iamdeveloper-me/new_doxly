Capistrano::Configuration::Namespaces::Namespace.class_eval do
  def capture(*args)
    parent.capture *args
  end
end

set :application,                "doxly"
set :deploy_via,                 :opsworks
set :use_sudo,                   false
set :ssh_options,                { :forward_agent => true }
set :stages,                     ["qa", "demo", "production"]
set :default_stage,              "qa"
set :normalize_asset_timestamps, false
set :slack_url,                  "https://hooks.slack.com/services/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"
set :rollbar_token,              "bc3a8edfc8c146cd990c45158db8eae0"
set :nat_output,                 "NATDNS"
set :nat_ssh_user,               "ec2-user"
set :instance_ssh_user,          "ubuntu"
set :app_user,                   "deploy"

default_run_options[:pty] = true

before "deploy",                   "deploy:default_filter"
before "deploy",                   "notify:start_deploy"
after  "deploy",                   "notify:finish_deploy"
after  "deploy",                   "notify_rollbar"

before "deploy:migrations",        "deploy:default_filter"
before "deploy:migrations",        "notify:start_deploy"
after  "deploy:migrations",        "notify:finish_deploy"
after  "deploy:migrations",        "notify_rollbar"

before "deploy:make_assets",       "deploy:copy_default_client_logos"

namespace :deploy do

  task :default_filter do
    ENV["HOSTROLEFILTER"] ||= "app, worker"
  end

  task :generate_gem_license_documentation, :roles => :app do
    puts "Servers for task: %s" % (find_servers_for_task(current_task).map(&:host))
    run "cd #{current_path}; bundle exec license_finder --quiet; true"
  end
end

namespace :db do
  desc "Creates database"
  task :create, :roles => :app do
    run "cd #{current_path}; bundle exec rake db:create RAILS_ENV=#{rails_env}", :once => true
  end

  desc "Seeds Database"
  task :seed, :roles => :app do
    run "cd #{current_path}; bundle exec rake db:seed RAILS_ENV=#{rails_env}", :once => true
  end

  desc "Populates database with default data"
  task :populate, :roles => :app do
    run "cd #{current_path}; bundle exec rake data:default RAILS_ENV=#{rails_env}", :once => true
  end

  desc "Populates database with testing data"
  task :populate_testing, :roles => :app do
    run "cd #{current_path}; bundle exec rake data:testing RAILS_ENV=#{rails_env}", :once => true
  end
end

print_log = proc do |channel, stream, data|
  data.lines.each do |line|
    puts "%20s: %s" % [channel[:host], line.chomp]
  end
  break if stream == :err
end

namespace :tail do
  task :app, :roles => [:app, :worker] do
    sudo "tail --silent -f -n #{ENV["DEPTH"] || 0} #{current_path}/log/#{rails_env}.log", &print_log
  end
end

namespace :monit do
  task :status do
    sudo "monit status"
  end
end

task :notify_rollbar, :roles => :app do
  set :revision, `git log -n 1 --pretty=format:"%H"`
  set :local_user, `whoami`

  rails_env = fetch(:opsworks_stack, 'production')
  cmd       = %Q{curl https://api.rollbar.com/api/1/deploy/ -F access_token=#{rollbar_token} -F environment="#{rails_env}" -F revision=#{revision} -F local_username=#{local_user} >/dev/null 2>&1}
  system(cmd)
end