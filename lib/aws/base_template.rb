require 'erb'
require 'yaml'

class BaseTemplate
  attr_accessor :region, :outputs, :params, :variables, :ec2_client

  def initialize(region_name, outputs, params, ec2client)
    self.outputs    = outputs
    self.params     = params
    self.region     = region_name
    self.ec2_client = ec2client
    self.variables  = {}
  end

  def private_key_path
    File.expand_path("~/.ssh/id_rsa")
  end

  def private_key
    if File.exist?(private_key_path)
      File.read(private_key_path).gsub(/\n/, "\\n")
    else
      raise "Private key #{private_key_path} doesn't exist, can't create stack"
    end
  end

  def var(name)
    variables[name]
  end

  def output(name)
    outputs[name.to_s]
  end

  def param(name)
    params[name.to_s]
  end

  def as_domain(*args)
    args.join(".").split(".").reject { |str| str == "*" }.join(".") # i suck
  end

  def name_for_group_id(group_id)
    puts "Searching for group id: #{group_id}"
    groups = ec2_client.describe_security_groups(group_ids: Array(group_id.to_s))
    if group = groups.data[:security_group_info].first
      group[:group_name]
    else
      nil
    end
  end

  def render(template, vars = {})
    self.variables = vars
    result = ERB.new(template).result(binding)
    self.variables = nil
    result
  end

  def yaml_render(template, vars = {})
    YAML.load(render(template, vars))
  end

end
