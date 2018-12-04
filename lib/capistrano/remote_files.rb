require 'capistrano/opsworks/helpers'

Capistrano::Configuration.instance(:must_exist).load do

  self.singleton_class.instance_eval do
    unless ancestors.include? Capistrano::Opsworks::Helpers
      include Capistrano::Opsworks::Helpers
    end
  end

  namespace :remote_files do

    task :capture, :roles => :app do
      # file_path is passed in using "-s file_path=<path>"
      filename         = file_path.split('/').last
      remote_files_dir = "#{Dir.home.to_s}/remote_files/#{current_stack[:name].parameterize.underscore}"
      FileUtils.mkdir_p(remote_files_dir)

      download(file_path, remote_files_dir, :via => :scp, :recursive => true)

      puts "*** Remote file downloaded to: #{remote_files_dir}/#{filename}"
    end

    task :send_file, :roles => :app do
      # file_path is passed in using "-s file_path=<path>"
      filename         = file_path.split('/').last
      destination_path = "/tmp/#{filename}"

      upload(file_path, destination_path)

      puts "*** File uploaded to: #{destination_path}"
    end

  end

end