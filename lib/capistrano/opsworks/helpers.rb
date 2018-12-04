module Capistrano::Opsworks
  module Helpers

    def self.included(base)
      base.send(:alias_method, :run_without_opsworks, :run)
      base.send(:alias_method, :run, :run_with_opsworks)
    end

    def opsworks_client
      if !@_opsworks_client
        access_key, secret_key, region = fetch(:aws_access_key_id), fetch(:aws_secret_access_key), fetch(:aws_region)
        @_opsworks_client = Aws::OpsWorks::Client.new(access_key_id: access_key, secret_access_key: secret_key, region: region)
      end
      @_opsworks_client
    end

    def cloudformation_client
      if !@_cloudformation_client
        access_key, secret_key = fetch(:aws_access_key_id), fetch(:aws_secret_access_key)
        @_cloudformation_client = Aws::CloudFormation::Client.new(access_key_id: access_key, secret_access_key: secret_key, region: current_stack[:region])
      end
      @_cloudformation_client
    end

    def ec2_client
      if !@_ec2_client
        access_key, secret_key = fetch(:aws_access_key_id), fetch(:aws_secret_access_key)
        @_ec2_client = Aws::EC2::Client.new(access_key_id: access_key, secret_access_key: secret_key, region: current_stack[:region])
      end
      @_ec2_client
    end

    def elb_client
      if !@_elb_client
        access_key, secret_key = fetch(:aws_access_key_id), fetch(:aws_secret_access_key)
        @_elb_client = Aws::ELB::Client.new(access_key_id: access_key, secret_access_key: secret_key, region: current_stack[:region])
      end
      @_elb_client
    end

    def stack_for_name(name)
      response = opsworks_client.describe_stacks()
      Array(response.data[:stacks]).detect { |stack| stack[:name] == name }
    end

    def app_for_name(stack_id, name)
      opsworks_client.describe_apps(stack_id: stack_id).data[:apps].detect { |app| app[:shortname] == name }
    end

    def current_stack
      unless (stack = stack_for_name(fetch(:opsworks_stack, nil)))
        raise "Couldn't find stack info for :opsworks_stack (#{fetch(:opsworks_stack, nil)}"
      end
      stack
    end

    def current_layers
      Array(opsworks_client.describe_layers(stack_id: current_stack[:stack_id]).data[:layers])
    end

    def current_instances
      current_layers.reduce([]) do |seed, layer|
        seed += Array(opsworks_client.describe_instances(layer_id: layer[:layer_id]).data[:instances])
      end
    end

    def current_cloudformation_stack
      client   = cloudformation_client
      stack    = current_stack
      stacks   = client.describe_stacks
      vpc_id   = stack[:vpc_id]
      stack_id = stack[:stack_id]
      cfstack  = client.describe_stacks().data[:stacks].detect do |_stack|
        if pair = _stack[:outputs].detect { |o| o[:output_key].to_s == "VPC" }
          pair[:output_value].to_s == vpc_id
        end
      end
      cfstack
    end

    def layer(layer_name, role_name)
      aws.opsworks.ensure
      role_name = role_name.to_sym
      @_opsworks_layers ||= {}
      @_opsworks_layers[layer_name.to_sym] ||= Set.new
      @_opsworks_layers[layer_name.to_sym] << role_name
      stack = current_stack
      layers = Array(opsworks_client.describe_layers(stack_id: stack[:stack_id]).data[:layers]).group_by { |h| h[:name].to_sym }
      role(role_name, no_release: true) do
        @_opsworks_layers.map do |layer_name, roles|
          if roles.include?(role_name)
            instances = opsworks_client.describe_instances(layer_id: layers[layer_name].first[:layer_id]).data[:instances]
            instances.select { |instance| instance[:status] == "online" }
                      .map { |instance| instance[:private_dns] }
          end
        end.flatten.compact.uniq
      end
    end

    def instances_for_stack(stack)
      layers = Array(opsworks_client.describe_layers(stack_id: stack).data[:layers])
      Hash[layers.map { |l| [l, instances_for_layer(l[:layer_id])]}]
    end

    def instances_for_layer(layer)
      opsworks_client.describe_instances(layer_id: layer).data[:instances]
    end

    def roles_for_layer_name(layer_name)
      @_opsworks_layers && @_opsworks_layers[layer_name.to_sym].to_a
    end

    def run_with_opsworks(*args, &block)
      aws.opsworks.ensure
      run_without_opsworks(*args, &block)
    end

    def cloudformation_output(name)
      cf_client    = cloudformation_client
      cf_stack     = current_cloudformation_stack
      output_entry = cf_stack[:outputs].detect { |entry| entry[:output_key] == name }
      output_entry && output_entry[:output_value]
    end

    def cloudformation_gateway_host(name = "NATDNS")
      cloudformation_output(name)
    end

  end
end
