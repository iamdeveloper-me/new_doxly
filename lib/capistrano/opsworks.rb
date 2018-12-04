require 'aws-sdk'
require 'capistrano/opsworks/helpers'
require 'aws/base_template'
require 'active_support'
require 'active_support/core_ext'

# OpsWorks Integration w/ Capistrano
#
# This file lets your Capistrano recipes work w/ an OpsWorks stack. You must
# have your instances available to SSH into via public_ip in order to work correctly.
#
# To enable, you must:
#
#   set :deploy_via, :opsworks
#
# You must also have the following keys specified:
#
#   set :aws_access_key_id, "YOUR AWS ACCESS KEY ID"
#   set :aws_secret_access_key, "YOUR AWS SECRET ACCESS KEY"
#
# Your application name (:application) must match the OpsWorks application shortname.
# You can specify a stack to deploy with via
#
#   set :opsworks_stack, "Name of Your Stack"
#
# If you don't specify a stack, the "alphabetically first" stack name will be chosen.
#
# You can choose how Capistrano roles map to Opsworks layers by using the "layer"
# command,
#
#   layer "My Rails App Layer", :app
#   layer "My Worker Box Layer", :worker
#
# Once enabled, deploy and deploy:migrations will issue deploys via the OpsWorks api
# on your behalf. You may also run other OpsWorks commands like:
#
#   aws:opsworks:commands:execute_recipes ( Specify a comma separated list of recipes to run via the RECIPES env var)
#   aws:opsworks:commands:install_dependencies
#   aws:opsworks:commands:update_custom_cookbooks
#   aws:opsworks:commands:update_dependencies
#   aws:opsworks:commands:deploy
#   aws:opsworks:commands:rollback
#   aws:opsworks:commands:start
#   aws:opsworks:commands:stop
#   aws:opsworks:commands:restart
#   aws:opsworks:commands:undeploy
#
# If you ned to specify custom JSON to be included with your command, you can do so
# via the CUSTOM_JSON env var.

STACK_DEPLOY_CMDS = %w{execute_recipes install_dependencies update_custom_cookbooks update_dependencies}.map(&:to_sym)
APP_DEPLOY_CMDS = %w{deploy rollback start stop restart undeploy}.map(&:to_sym)
DEPLOY_CMDS = (STACK_DEPLOY_CMDS + APP_DEPLOY_CMDS)

Capistrano::Configuration.instance(:must_exist).load do

  self.singleton_class.instance_eval do
    attr_accessor :opsworks_update_code
    attr_accessor :opsworks_run_migrations
    attr_accessor :opsworks_restart
    attr_accessor :opsworks_enabled
    attr_accessor :opsworks_checked
    include Capistrano::Opsworks::Helpers
  end


  before("deploy:update_code") { self.opsworks_update_code    = true }
  before("deploy:migrations")  { self.opsworks_run_migrations = true }
  before("deploy:restart")     { self.opsworks_restart        = true }
  after("deploy:restart") do
    if opsworks_enabled && !opsworks_update_code
      aws.opsworks.commands.restart
    end
  end
  DEPLOY_CMDS.each do |deploy_cmd|
    before "aws:opsworks:commands:#{deploy_cmd.to_s}", "aws:opsworks:ensure"
  end
  before "aws:opsworks:describe", "aws:opsworks:ensure"


  namespace :aws do
    namespace :opsworks do
      task :ensure do
        if !opsworks_checked
          self.opsworks_checked = true
          if fetch(:deploy_via, nil) == :opsworks
            if fetch(:aws_access_key_id, "").blank? ||
                fetch(:aws_secret_access_key, "").blank?
              raise ":aws_access_key_id and :aws_secret_access_key must both be set before you can use Opsworks"
            end
            if fetch(:opsworks_stack, "").blank?
              response = opsworks_client.describe_stacks
              if response.data.empty?
                raise "No :opsworks_stack was specified and a default stack could not be selected"
              end
              stacks = response.data[:stacks].sort_by { |h| h[:name] }
              default_stack = stacks.first
              set :opsworks_stack, default_stack[:name]
              puts "No :opswork_stack was specified so using stack #{default_stack[:name]} / #{default_stack[:stack_id]}"
            end
            stack = stack_for_name(fetch(:opsworks_stack))
            if stack.blank?
              abort "Could not fetch :opsworks_stack information, you may not have permissions to access it."
            end
            attrs = if stack[:custom_json]
              JSON.parse(stack[:custom_json])
            else
              {}
            end
            application_name = fetch(:application)
            app = app_for_name(stack[:stack_id], application_name)
            deploy_data = attrs['deploy'] || {}
            app_data = deploy_data[application_name] || {}
            deploy_location = app_data['deploy_to'] || "/srv/www/#{application_name}/"
            deploy_user = app_data['user'] || "deploy"
            instance_ssh_user = fetch(:instance_ssh_user, deploy_user)
            puts "Setting deploy user to #{instance_ssh_user}"
            set :user, instance_ssh_user
            puts "Setting deploy location to #{deploy_location}"
            set :deploy_to, deploy_location
            set :scm, :none
            set :branch_name, app[:app_source][:revision]

            gateway = cloudformation_gateway_host(fetch(:nat_output, "NATDNS"))
            if gateway.present?
              gateway_user = fetch(:nat_ssh_user, fetch(:user, "deploy"))
              set :gateway, "%s@%s" % [gateway_user, gateway]
            end

            self.opsworks_enabled = true

            # Don't let these steps kill the Capistrano workflow
            # These all should no-op in the OpsWorks world
            [:update_code, :finalize_update, :create_symlink].each do |override_task|
              deploy.tasks[override_task].options ||= {}
              deploy.tasks[override_task].options[:on_no_matching_servers] = :continue
            end

          end
        end
      end

      task :describe do
        stack   = current_stack
        result  = instances_for_stack(stack[:stack_id])
        puts "STACK %s (%s)" % [stack[:name], stack[:stack_id]]
        result.each do |layer, instances|
          puts "====%s (%s)====" % [layer[:name], layer[:layer_id]]
          instances.each do |instance|
            puts "%s:: %s (%s) -- %s / %s" % [instance[:status], instance[:hostname], instance[:instance_id], instance[:public_ip], instance[:private_ip]]
          end
          puts ""
        end
      end

      task :ssh do
        natdns = cloudformation_gateway_host(fetch(:nat_output, "NATDNS"))
        if natdns.present?
          gateway_host = natdns
          ssh_host     = fetch(:instance)
          stack        = current_stack
          result       = instances_for_stack(stack[:stack_id])
          all_hosts    = result.values.flatten
          host         = if ssh_host.present?
                           all_hosts.detect { |instance| instance[:hostname] == ssh_host }
                         else
                           all_hosts.first
                         end
          if host.present?
            nat_ssh_user      = fetch(:nat_ssh_user, fetch(:user, "deploy"))
            instance_ssh_user = fetch(:instance_ssh_user, fetch(:user, "deploy"))
            cmd = "ssh -A -t -l %s %s ssh -A -t -l %s %s" % [nat_ssh_user, gateway_host, instance_ssh_user, host[:private_ip]]
            puts "CMD: %s" % cmd
            exec cmd
          else
            puts "Instance not found, valid values are:\n%s " % all_hosts.map { |instance| instance[:hostname] }.join("\n")
            exit 1
          end
        else
          exit 1
        end
      end

      namespace :commands do

        DEPLOY_CMDS.each do |deploy_cmd|
          task deploy_cmd do
            deploy_options = { command: { name: deploy_cmd.to_s, args: {} }, comment: "#{`whoami`.chomp} running #{deploy_cmd.to_s} via Capistrano" }
            if deploy_cmd == :execute_recipes
              recipes = ENV["RECIPES"].to_s.split(",")
              raise "You must specify ENV['RECIPES'] if you intend to call execute_recipes" if recipes.blank?
              deploy_options[:command][:args]["recipes"] = recipes
            end
            stack = current_stack
            deploy_options[:stack_id] = stack[:stack_id]
            application_name = fetch(:application)
            all_instances = Array(opsworks_client.describe_instances(stack_id: stack[:stack_id]).data[:instances])
            if APP_DEPLOY_CMDS.include?(deploy_cmd)
              app = app_for_name(stack[:stack_id], application_name)
              if app.blank?
                raise "Couldn't find app matching #{app}"
              end
              puts "Using application #{app[:shortname]} (#{app[:app_source][:url]}##{app[:app_source][:revision]})"
              deploy_options[:app_id] = app[:app_id]
            end
            current_hosts = find_servers_for_task(current_task).map(&:host)
            current_instances = all_instances.select { |instance| current_hosts.include?(instance[:private_dns]) }
            deploy_options[:instance_ids] = current_instances.map { |instance| instance[:instance_id] }
            instance_descs = current_instances.map { |instance| "#{instance[:hostname]} (#{instance[:private_dns]})"}
            if (json = ENV["CUSTOM_JSON"]) || opsworks_run_migrations
              if opsworks_run_migrations
                attribs = json ? JSON.parse(json) : {}
                attribs['deploy'] ||= {}
                attribs['deploy'][application_name] ||= {}
                attribs['deploy'][application_name]['migrate'] = true
                json = attribs.to_json
              end
              deploy_options[:custom_json] = json
              puts "Sending command #{deploy_cmd.to_s} to #{instance_descs.inspect} with custom json #{json}"
            else
              puts "Sending command #{deploy_cmd.to_s} to #{instance_descs.inspect}"
            end
            deploy_response = opsworks_client.create_deployment(deploy_options)
            deploy_id = deploy_response[:deployment_id]
            loop do
              deploys = opsworks_client.describe_deployments(deployment_ids: [deploy_id])
              deploy = deploys.data[:deployments].first
              if deploy[:completed_at].present?
                puts "Command #{deploy_cmd.to_s} finished (STATUS: #{deploy[:status]}), took #{deploy[:duration]} seconds"
                if deploy[:status] != "successful"
                  raise "Error ocurred during command #{deploy_cmd.to_s}, status: #{deploy[:status]}"
                end
                break
              end
              puts "Waiting on command: #{deploy_cmd.to_s} (STATUS: #{deploy[:status]})"
              sleep(20)
            end
          end
        end
      end
    end
  end
end

