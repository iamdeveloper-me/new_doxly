class SeeUnityImanageUserCredential < ActiveRecord::Base
  attr_accessor :username, :password
  has_one :dms_user_credential, as: :dms_user_credentialable, dependent: :destroy, autosave: true
  has_many :critical_errors, :as => :critical_errorable, :autosave => true, :inverse_of => :critical_errorable, dependent: :destroy
  validates_presence_of :access_token

  WORKSPACE_REPOSITORY_DESCRIPTIONS =  {
    matter_worklist: 'Matter Worklist',
    document_worklist: 'Document Worklist',
    my_matters: 'My Matters',
    my_favorites: 'My Favorites'
  }

  def set_refresh_token!(entity_user)
    api = SeeUnityImanageApi.new(entity_user, { try_again: false })
    begin
      response = api.get_refresh_token(username, password)
    rescue
      # product has a specific alert message that they want to show, so I can't go through the normal exception handling.
      return false
    end
    set_tokens!(response)
    set_dms_user_credential(entity_user)
    get_repository_workspace_ids(entity_user)
  end

  def set_access_token!(entity_user)
    api = SeeUnityImanageApi.new(dms_user_credential.entity_user, { try_again: false})
    response = api.get_access_token
    set_tokens!(response)
  end

  def set_dms_user_credential(entity_user)
    unless DmsUserCredential.find_by(entity_user_id: entity_user.id)
      dms_user_credential = entity_user.build_dms_user_credential
      dms_user_credential.dms_user_credentialable = self
      dms_user_credential.save
    end
  end

  def set_tokens!(response)
    update(access_token: response["AccessToken"], refresh_token: response["RefreshToken"])
  end

  def get_repository_workspace_ids(entity_user)
    # recreate the api because need the new instance variables now that we are authenticated.
    api = SeeUnityImanageApi.new(entity_user, { try_again: false })
    response = api.get_repository_workspace_ids
    set_repository_workspace_ids(response)
  end

  def set_repository_workspace_ids(response)
    self.my_matters_repository_id        = response.find{|workspace| workspace["Description"] == WORKSPACE_REPOSITORY_DESCRIPTIONS[:my_matters] }["EID"]
    self.my_favorites_repository_id      = response.find{|workspace| workspace["Description"] == WORKSPACE_REPOSITORY_DESCRIPTIONS[:my_favorites] }["EID"]
    self.matter_worklist_repository_id   = response.find{|workspace| workspace["Description"] == WORKSPACE_REPOSITORY_DESCRIPTIONS[:matter_worklist] }["EID"]
    self.document_worklist_repository_id = response.find{|workspace| workspace["Description"] == WORKSPACE_REPOSITORY_DESCRIPTIONS[:document_worklist] }["EID"]
    save
  end


  def create_critical_error(error_type, options={})
    self.critical_errors.new.save_new!(error_type, options)
  end

end
