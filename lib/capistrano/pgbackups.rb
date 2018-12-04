require 'capistrano/opsworks/helpers'

Capistrano::Configuration.instance(:must_exist).load do

  self.singleton_class.instance_eval do
    unless ancestors.include? Capistrano::Opsworks::Helpers
      include Capistrano::Opsworks::Helpers
    end
  end

  # Modeled after Heroku's pgbackups -- See: https://devcenter.heroku.com/articles/pgbackups
  namespace :pgbackups do

    task :capture, :roles => :app do
      db = JSON.parse(current_stack[:custom_json])["deploy"]["doxly"]["database"]

      backup_dir     = Pathname.new(Dir.home).join('pgbackups').tap(&:mkpath)
      backup_file    = backup_dir.join([Time.now.utc.to_i.to_s, current_stack[:name].parameterize.underscore, 'dump'].join('.'))
      backup_file_io = backup_file.open('w')

      pg_dump_cmd = "pg_dump --clean --no-owner --no-acl --disable-triggers --host=#{db['host']} --port=#{db['port'] || 5432} --username=#{db['username']} #{db['database']}"


      password_sent = false
      run(pg_dump_cmd, :once => true) do |channel, stream, data|
        if !password_sent && data.downcase["password"]
          channel.send_data(db['password'] + "\n")
          password_sent = true
          next
        end
        backup_file_io.write(data) if stream == :out
      end
      backup_file_io.close

      puts "*** Backup File: #{backup_file.to_path}"
    end
  end

end
