require_relative 'helper'

set :aws_access_key_id,     app_config["aws_access_key_id"]
set :aws_secret_access_key, app_config["aws_secret_access_key"]
set :aws_region,            app_config["aws_region"]
set :opsworks_stack,        "production-1-4-6"

layer "Rails App Server",   :app
layer "Worker Server",      :worker
