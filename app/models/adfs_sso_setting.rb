class AdfsSsoSetting < ActiveRecord::Base
  has_one :sso_provider_configurationable, as: :polymorphic

  validates_presence_of :issuer_name, :issuer, :realm, :reply, :saml_version, :id_claim, :idp_cert, :logout_url
end
