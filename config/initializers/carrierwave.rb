CarrierWave::SanitizedFile.sanitize_regexp = /[^[:word:]\.\-\+]/

CarrierWave.configure do |config|
  config.fog_public     = false                                        # optional, defaults to true
  config.fog_provider   = 'fog/aws'
  if Doxly.config.aws_enabled
    config.fog_credentials = {
      :provider               => 'AWS',                                # required
      :aws_access_key_id      => Doxly.config.aws_access_key_id,       # required
      :aws_secret_access_key  => Doxly.config.aws_secret_access_key    # required
    }
    config.fog_directory  = Doxly.config.s3_bucket                     # required
    config.fog_attributes = {'x-amz-server-side-encryption'=>'AES256'}
  else
    config.fog_credentials = {
      :provider               => 'AWS',                                # required
      :aws_access_key_id      => 123,                                  # required -- uses fakes3
      :aws_secret_access_key  => 'abcd',                               # required -- uses fakes3
      :port                   => Rails.env.test? ? 5100 : 3100,
      :host                   => Doxly.config.host_name,
      :scheme                 => 'http'
    }
    config.fog_directory = Rails.env.test? ? 'doxly-test' : 'doxly'
  end
end
