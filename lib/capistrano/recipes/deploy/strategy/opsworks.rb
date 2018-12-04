require 'capistrano/recipes/deploy/strategy/base'

class Capistrano::Deploy::Strategy::Opsworks < Capistrano::Deploy::Strategy::Base
  def initialize(configuration)
    @config = configuration
  end

  def deploy!
    if @config.opsworks_update_code
      @config.find_and_execute_task("aws:opsworks:commands:deploy")
    end
  end

  def check!
    # no op
  end
end
