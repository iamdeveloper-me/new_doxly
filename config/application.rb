require File.expand_path('../boot', __FILE__)

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
if defined?(Bundler)
  # If you precompile assets before deploying to production, use this line
  Bundler.require(*Rails.groups(:assets => %w(development test)))
  # If you want your assets lazily compiled in production, use this line
  # Bundler.require(:default, :assets, Rails.env)
end

require File.expand_path('../../lib/in_process_cache',  __FILE__)
require File.expand_path('../../lib/config',            __FILE__)

module Doxly
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # The default locale is :en and all translations from config/locales/*.rb,yml are auto loaded.
    config.i18n.load_path += Dir[Rails.root.join('config', 'locales', '*.{rb,yml}').to_s]
    config.i18n.default_locale = :en

    # See: http://stackoverflow.com/questions/20361428/rails-i18n-validation-deprecation-warning
    config.i18n.enforce_available_locales = false

    # Configure the default encoding used in templates for Ruby 1.9.
    config.encoding = "utf-8"

    # Configure sensitive parameters which will be filtered from the log file.
    config.filter_parameters += [:password]

    # Enable the asset pipeline
    config.assets.enabled = true

    # Version of your assets, change this if you want to expire all your assets
    config.assets.version = '1.0'

    #precompile jquery and temporal
    config.assets.precompile += %w( login.js jquery.js temporal.js react.bundle.js foundation_emails.css )
    config.assets.paths << Rails.root.join("app", "assets", "fonts")
    config.assets.paths << Rails.root.join("app", "assets", "images")
    config.assets.paths << Rails.root.join("app", "frontend", "dist")

    config.action_mailer.asset_host = Proc.new { |source, request|
      path =  "#{Doxly.config.protocol}://#{Doxly.config.host_name}"
      path += ":#{Doxly.config.port}" unless Rails.env.production?
      path
    }
    config.action_controller.asset_host = config.action_mailer.asset_host

    # The application routes will handle the forwarding of the exceptions
    config.exceptions_app = self.routes

    # Use a real queuing backend for Active Job (and separate queues per environment)
    config.active_job.queue_adapter     = :delayed_job
    # config.active_job.queue_name_prefix = "app_#{Rails.env}"

    config.cache_store = :memory_store

    # Custom directories with classes and modules you want to be autoloadable.
    config.autoload_paths += %W(#{config.root}/app/errors)

    config.active_record.raise_in_transactional_callbacks = true

    config.action_dispatch.default_headers['X-Frame-Options'] = "SAMEORIGIN"

    config.middleware.insert_before 0, "Rack::Cors" do
      allow do
        origins /https:\/\/.*\.(.*\.|)doxly\.com/, /http:\/\/app\.localhost\.com:[0-9]*/, /http:\/\/.*\.lvh\.me:[0-9]*/, /http:\/\/.*\.ngrok\.io/
        resource '*',
          :headers => ['Accept', 'Accept-Language', 'Content-Language', 'Content-Type', 'X-User-Token', 'X-User-Email', 'X-Entity-User-Id', 'Origin'],
          :methods => [:get, :post, :put, :options, :delete],
          :expose  => ['Auth-Token']
      end
    end
  end
end
