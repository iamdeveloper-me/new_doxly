# ========== NOT SUBCLASSED FROM DmsEntityStorage. SHOULD TREAT AS SAME LEVEL AS AwsEntityStorage ==========
class NetDocumentsEntityStorage < ActiveRecord::Base
  has_one :dms_entity_storage, as: :dms_entity_storageable
  has_one :entity, through: :dms_entity_storage
  # unit is minutes
  validates_numericality_of :document_retention_minutes_duration, greater_than_or_equal_to: Doxly.config.minimum_document_retention_minutes_duration, allow_nil: true
  validates_inclusion_of :instance_location, in: %w(us eu au)

  # analagous to the get_bucket and get_path methods in the other entity_storage models
  def base_url
    Doxly.config.send("net_documents_#{instance_location}_api_url")
  end

  def get_base_api_url
    base_url + "/v#{Doxly.config.net_documents_api_version_number}"
  end

  def get_client_id
    Doxly.config.send("net_documents_#{instance_location}_client_id")
  end

  def get_client_secret
    Doxly.config.send("net_documents_#{instance_location}_client_secret")
  end

  def get_login_base_url
    Doxly.config.send("net_documents_#{instance_location}_login_base_url")
  end

  def get_full_login_url
    get_login_base_url + "?client_id=#{get_client_id}&scope=full&response_type=code&redirect_uri=#{get_redirect_uri}"
  end

  def get_redirect_uri
    "#{Doxly.config.protocol}://#{Doxly.config.host_name}#{Rails.application.routes.url_helpers.authorize_net_documents_user_credentials_path}" # if testing locally, must set protocol to https
  end

  def dms_deal_detailable_class
    NetDocumentsDealStorageDetails
  end

  def version_storage_class
    NetDocumentsVersionStorage
  end

  def net_documents_local_path
    path = "#{Rails.root.to_s}/#{Doxly.config.net_documents_hdd_storage_dir}"
    Dir.mkdir(path) unless Dir.exists?(path)
    path
  end

  def get_local_storage_path
    path = "#{net_documents_local_path}/entity-#{entity.id}"
    Dir.mkdir(path) unless Dir.exists?(path)
    path
  end
end
