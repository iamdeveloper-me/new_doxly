class DmsUserCredential < ActiveRecord::Base
  belongs_to :entity_user
  belongs_to :dms_user_credentialable, polymorphic: true

  validates_presence_of :dms_user_credentialable, :entity_user
end
