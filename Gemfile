source 'https://rubygems.org'

gem 'rails'                         , '4.2.10'
gem 'pg'                            , '0.21.0'
gem 'kaminari'                      , '1.1.1'
gem 'american_date'                 , '1.1.1'
gem 'fog-aws'                       , '2.0.1' # S3 integration for CarrierWave
gem 'carrierwave'                   , '1.2.2'
gem 'delayed_job'                   , '4.1.5'
gem 'delayed_job_active_record'     , '4.1.3'
gem 'devise'                        , '4.5.0'
gem 'jquery-rails'                  , '4.3.1'
gem 'autonumeric-rails'             , '2.0.0.1'
gem 'rubyzip'                       , '1.2.2' # Will load new rubyzip version
gem 'zip-zip'                       , '0.3'   # Will load compatibility for old rubyzip API.
gem 'combine_pdf'                   , '1.0.9' # Comibed multiple PDF's into a single PDF -- for ClosingBooks
gem 'wicked_pdf'                    , '1.1.0'
gem 'wkhtmltopdf-binary'            , '0.12.3.1'
gem 'msgpack'                       , '1.2.4', require: 'msgpack'
gem 'turbolinks'                    , '5.1.1'
gem 'turboboost'                    , '0.1.1'
gem 'mini_magick'                   , '4.8.0'
gem 'sprockets-es6'                 , '0.9.2', require: 'sprockets/es6'
gem 'inky-rb'                       , '1.3.7.2', require: 'inky'
gem 'introjs-rails'                 , '1.0.0'
gem 'premailer-rails'               , '1.10.2' # Stylesheet inlining for email
gem 'oj'                            , '3.6.6'
gem 'acts_as_list'                  , '0.9.15'
gem "font-awesome-rails"            , '4.7.0.4'
gem 'temporal-rails'                , '0.2.4'
gem 'daemons'                       , '1.2.6'
gem 'omniauth'                      , '1.8.1'
gem 'omniauth-wsfed'                , '0.3.3-beta'
gem 'fuzzy_match'                   , '2.1'
gem 'gmail'                         , '0.6.0'
gem 'ancestry'                      , '3.0.1'
gem 'rails_admin'                   , '1.3.0'
gem 'useragent'                     , '0.16.10'
gem 'rmagick'                       , '2.16.0'
gem 'zxing_cpp'                     , '0.1.1'
gem 'barby'                         , '0.6.6' # QR Code generation
gem 'rqrcode'                       , '0.10.1' # QR Code generation (need both)
gem 'simple_token_authentication'   , '1.15.1'
gem 'rack-cors'                     , '1.0.2', require: 'rack/cors'
gem 'dropzonejs-rails'              , '0.8.2'
gem 'zbar'                          , '0.3.0'
gem 'aws-sdk'                       , '3.0.1'
gem 'jwt'                           , '2.1.0'
gem 'axlsx_rails'                   , '0.5.1'
gem 'axlsx'                         , git: 'https://github.com/randym/axlsx.git', ref: '776037c0fc799bb09da8c9ea47980bd3bf296874'
gem 'asposewordsjavaforruby'        , '0.0.6', git: 'https://1d1bc78e691ffc182aec6498b439e352aa7eb031@github.com/doxly-inc/aspose-words-java-for-ruby.git', :branch => 'master'
gem 'cloudconvert-ruby'             , '0.2.0'
gem 'docusign_rest'                 , '0.1.1', git: 'https://github.com/mdwaram/docusign_rest.git', :branch => 'master' # Needed until/unless https://github.com/jondkinney/docusign_rest/pull/63 is merged
gem 'active_model_serializers'      , '0.10.5', git: 'https://github.com/ifasoldt/active_model_serializers.git', :branch => 'master'
gem 'sprite-factory'                , '1.7.1'
gem 'devise-two-factor'             , '3.0.3'
gem 'thin'                          , '1.7.2'
gem 'watir'                         , '6.11.0'
gem 'headless'                      , '2.3.1'
gem 'webdrivers'                    , '3.4.3'
gem 'caracal'                       , '1.2.0'
gem 'clipboard-rails'               , '1.7.1'
gem 'goldiloader'                   , '2.1.1' # Automated eager loading for AR
gem 'faraday'                       , '0.15.2'

group :assets do
  gem 'sass-rails'                  , '5.0.7' # Use SCSS for stylesheets
  gem 'therubyracer'                , '0.12.3', platforms: :ruby
  gem 'uglifier'                    , '4.1.9' # Use Uglifier as compressor for JavaScript assets
end

group :development do
  gem 'capistrano'                  , '2.15.5', require: false # Deployment
  gem 'capistrano-ext'              , '1.2.1', require: false # Used for multi-stage deploys
  gem 'slack-notifier'              , '2.3.2', require: false
  gem 'better_errors'               , '2.4.0'
  gem 'binding_of_caller'           , '0.8.0'
  gem 'pry-rails'                   , '0.3.6'
  gem 'apipie-rails'                , '0.5.10'
end

group :development, :test do
  gem 'byebug'                      , '10.0.2'
  gem 'fakes3'                      , '1.2.1'
end

group :development, :qa do
  gem 'mail_safe'                   , '0.3.4'
end

group :qa, :staging, :producton do
  gem 'rollbar'                     , '2.16.3'
end

group :test do
  gem 'ffaker'                      , '2.9.0'
  gem 'rspec-rails'                 , '3.7.2'
  gem 'shoulda-matchers'            , '3.1.2'
  gem 'factory_girl_rails'          , '4.9.0'
end
