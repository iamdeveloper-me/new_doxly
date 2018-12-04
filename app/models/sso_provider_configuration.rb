class SsoProviderConfiguration < ActiveRecord::Base
  belongs_to :entity
  belongs_to :sso_provider_configurationable, polymorphic: true

  validates_presence_of :provider_type, :entity, :sso_provider_configurationable

  scope :active, -> { where(is_active: true) }
end
