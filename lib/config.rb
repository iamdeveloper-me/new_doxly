require 'yaml'

# Access config.yml through Doxly.config
module Doxly
  # Loads config yaml file and builds a hash that has a method missing on it
  def self.config
    InProcessCache.store(:application_config, 15.seconds) do
      begin
        config = ActiveSupport::OrderedOptions.new
        file_name = file_path
        if File.exist?(file_name)
          hash = YAML.load(File.read(file_name))
          # merge the default keys, if available
          keys_hash = (hash["default"] || {}).merge(hash[Rails.env] || {})
          keys_hash.each_pair do |k, v|
           config[k] = v
          end
        else
          raise %Q{
            Missing config.yml! Do this to fix it:
            cp #{Rails.root}/config/config.example.yml #{Rails.root}/config/config.yml
          }
        end
        # Raises an error if a key is attempted to be retrieved that doesn't exist.
        config.default_proc = lambda do |hsh, k|
          raise "Key #{k.inspect} not found in config.yml file."
        end
        config
      end
    end
  end

  # Returns the file path to the config file
  def self.app_root
    File.expand_path(File.join(File.dirname(__FILE__), ".."))
  end

  def self.file_path
    "#{app_root}/config/config.yml"
  end
end