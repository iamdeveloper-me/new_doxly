class NetDocumentsUserCredential < ActiveRecord::Base
  has_one   :dms_user_credential, as: :dms_user_credentialable, dependent: :destroy, autosave: true
  has_many :critical_errors, :as => :critical_errorable, :autosave => true, :inverse_of => :critical_errorable, dependent: :destroy

  validates_presence_of :access_token, :refresh_token


  def set_refresh_token!(entity_user, code)
    api = NetDocumentsApi.new(entity_user)
    begin
      response = api.get_refresh_token(code)
    rescue
      # need to rescue here because we don't want to go through the normal exception handling
      return false
    end
    set_tokens!(response)
  end

  def set_access_token!(entity_user)
    api = NetDocumentsApi.new(dms_user_credential.entity_user, { try_again: false})
    response = api.get_access_token
    set_tokens!(response)
  end

  def set_tokens!(response)
    assign_attributes(response.slice("access_token", "refresh_token"))
    save
  end

  def create_critical_error(error_type, options={})
    self.critical_errors.new.save_new!(error_type, options)
  end

end
