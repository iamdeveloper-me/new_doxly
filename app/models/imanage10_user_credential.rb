class Imanage10UserCredential < ActiveRecord::Base
  attr_accessor :username, :password
  has_one :dms_user_credential, as: :dms_user_credentialable, dependent: :destroy, autosave: true
  has_many :critical_errors, :as => :critical_errorable, :autosave => true, :inverse_of => :critical_errorable, dependent: :destroy
  validates_presence_of :access_token, :customer_id, :imanage10_user_object

  def set_access_token!(entity_user)
    api = Imanage10Api.new(entity_user)
    begin
      response = api.get_access_token(username, password)
    rescue
      # product has a specific alert message that they want to show, so I can't go through the normal exception handling.
      return false
    end
    set_user_info!(response)
  end

  def set_user_info!(response)
    access_token = response["X-Auth-Token"]
    customer_id  = response["customer_id"]
    imanage10_user_object = response["user"]
    assign_attributes(access_token: access_token, customer_id: customer_id, imanage10_user_object: imanage10_user_object)
    save
  end

  def create_critical_error(error_type, options={})
    self.critical_errors.new.save_new!(error_type, options)
  end

end
