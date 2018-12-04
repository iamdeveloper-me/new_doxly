base_dir = File.expand_path(File.dirname(__FILE__))
$: << File.join(base_dir, "lib")

require 'capistrano/ext/multistage'
require 'capistrano/opsworks'
require 'capistrano/pgbackups'
require 'capistrano/remote_files'
require base_dir + '/config/deploy/notification'
require base_dir + '/config/deploy/performance'

load 'deploy'
load 'config/deploy' # remove this line to skip loading any of the default tasks
