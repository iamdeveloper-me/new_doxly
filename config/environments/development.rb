Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  config.action_mailer.delivery_method = :smtp
  config.action_mailer.smtp_settings = {
    :user_name => Doxly.config.mailtrap_username,
    :password => Doxly.config.mailtrap_password,
    :address => 'smtp.mailtrap.io',
    :domain => 'smtp.mailtrap.io',
    :port => '2525',
    :authentication => :cram_md5
  }

  # In the development environment your application's code is reloaded on
  # every request. This slows down response time but is perfect for development
  # since you don't have to restart the web server when you make code changes.
  config.cache_classes = false

  # Log error messages when you accidentally call methods on nil.
  config.whiny_nils = true

  # Do not eager load code on boot.
  config.eager_load = false

  # Show full error reports.
  config.consider_all_requests_local = true
  config.action_controller.perform_caching = false

  # Only include controller specific helpers
  config.action_controller.include_all_helpers = false

  # Don't care if the mailer can't send.
  config.action_mailer.raise_delivery_errors = false

  # These will send emails through mailcatcher
  # https://mailcatcher.me/
  config.action_mailer.default_url_options = { :host => Doxly.config.host_name, :port => 3000 }

  # Print deprecation notices to the Rails logger.
  config.active_support.deprecation = :log

  # Raise an error on page load if there are pending migrations.
  config.active_record.migration_error = :page_load

  # Do not dump schema after migrations.
  config.active_record.dump_schema_after_migration = false

  # Only use best-standards-support built into browsers
  config.action_dispatch.best_standards_support = :builtin

  # Debug mode disables concatenation and preprocessing of assets.
  # This option may cause significant delays in view rendering with a large
  # number of complex assets.
  config.assets.debug = true

 # Do not compress assets
  config.assets.compress = false

  # Asset digests allow you to set far-future HTTP expiration dates on all assets,
  # yet still be able to expire them through the digest params.
  config.assets.digest = true

  # Adds additional error checking when serving assets at runtime.
  # Checks for improperly declared sprockets dependencies.
  # Raises helpful error messages.
  config.assets.raise_runtime_errors = true

  config.eager_load = false

  # Raises error for missing translations
  # config.action_view.raise_on_missing_translations = true

  # Test assets pre-compile
  #config.serve_static_assets = false
  #config.assets.compress = true
  #config.assets.compile = false
  #config.assets.digest = true
end
