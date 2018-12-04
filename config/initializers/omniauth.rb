Rails.application.config.middleware.use OmniAuth::Builder do
  provider :wsfed, setup: true
end