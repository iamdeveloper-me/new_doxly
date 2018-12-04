require 'yaml'

def app_config_path
  path = File.expand_path(File.join(File.dirname(__FILE__), ".."))
  "#{path}/config.yml"
end

def app_config
  @app_config ||= begin
    hash = YAML.load(File.read(app_config_path))
    (hash["default"] || {}).merge(hash["development"] || {})
  end
end