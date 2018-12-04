rails_env            = 'production'
deploy               = node[:deploy]['doxly']
deploy_to            = deploy[:deploy_to]
app_config           = deploy['config_yml'] || {}
secrets_config       = deploy['secrets_yml'] || {}
stack_name           = node[:opsworks][:stack][:name]

Chef::Log.info("Running for layers: %s" % node[:opsworks][:instance][:layers].inspect)

Chef::Log.info("Ensuring Application config...")
template "#{release_path}/config/config.yml" do
  local true
  owner 'deploy'
  group 'root'
  mode 0644
  source "#{release_path}/deploy/templates/config.yml.erb"
  variables :environment => rails_env, :settings => app_config
end

Chef::Log.info("Ensuring application secrets...")
template "#{release_path}/config/secrets.yml" do
  local true
  owner 'deploy'
  group 'root'
  mode 0644
  source "#{release_path}/deploy/templates/secrets.yml.erb"
  variables :environment => rails_env, :settings => secrets_config
end

%w{assets uploads}.each do |dir|
  Chef::Log.info("Ensuring shared #{dir} directory")
  directory "/mnt/data/#{dir}" do
    group deploy[:group]
    owner deploy[:user]
    mode 0775
    action :create
    recursive true
  end

  Chef::Log.info("Symlinking #{release_path}/public/#{dir} to /mnt/data/#{dir}")
  link "#{release_path}/public/#{dir}" do
    to "/mnt/data/#{dir}"
  end
end

%w{storage}.each do |dir|
  Chef::Log.info("Ensuring shared #{dir} directory")
  directory "/mnt/data/#{dir}" do
    group deploy[:group]
    owner deploy[:user]
    mode 0775
    action :create
    recursive true
  end

  Chef::Log.info("Symlinking #{release_path}/#{dir} to /mnt/data/#{dir}")
  link "#{release_path}/#{dir}" do
    to "/mnt/data/#{dir}"
  end
end

%w{signature-management closing-books tempdir hdd-storage}.each do |dir|
  Chef::Log.info("Ensuring shared storage/#{dir} directory")
  directory "/mnt/data/storage/#{dir}" do
    group deploy[:group]
    owner deploy[:user]
    mode 0775
    action :create
    recursive true
  end
end

if Dir["#{deploy_to}/releases/**"].size <= 1 # Only try to create the db if no releases exist yet
  Chef::Log.info("Ensuring database exists for RAILS_ENV=#{rails_env}...")
  execute "rake db:create" do
    cwd release_path
    command "bundle exec rake db:create"
    environment "RAILS_ENV" => rails_env
  end
end

execute "clone the pdflib repo" do
  user deploy[:user]
  cwd "/srv/www/doxly/shared"
  command "git clone https://1d1bc78e691ffc182aec6498b439e352aa7eb031@github.com/doxly-inc/doxly-pdflib.git"
  not_if { ::Dir.exist?("/srv/www/doxly/shared/doxly-pdflib") }
end

execute "install pdflib executable" do
  user deploy[:user]
  cwd "/srv/www/doxly/shared/doxly-pdflib"
  command "./install.sh linux"
end

template "/srv/www/doxly/shared/doxly-pdflib/include/licensekey.h" do
  local true
  owner 'deploy'
  mode 0644
  source "#{release_path}/deploy/templates/pdflib.licensekey.erb"
end

execute "generate pdflib executable" do
  user deploy[:user]
  cwd "/srv/www/doxly/shared/doxly-pdflib"
  command "./compile.sh \"#{release_path}\""
end

execute "write revision" do
  cwd release_path
  command "git log -n 1 --pretty=format:\"%H\" > REVISION"
end

execute "write stack" do
  cwd release_path
  command "echo \"#{stack_name}\" > STACK"
end