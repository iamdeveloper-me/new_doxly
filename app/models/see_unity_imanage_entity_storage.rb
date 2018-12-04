# ========== NOT SUBCLASSED FROM DmsEntityStorage. SHOULD TREAT AS SAME LEVEL AS AwsEntityStorage ==========
class SeeUnityImanageEntityStorage < ActiveRecord::Base
  has_one :dms_entity_storage, as: :dms_entity_storageable
  has_one :entity, through: :dms_entity_storage
  # unit is minutes
  validates_numericality_of :document_retention_minutes_duration, greater_than_or_equal_to: Doxly.config.minimum_document_retention_minutes_duration, allow_nil: true
  validates_presence_of :see_unity_instance_url, :connector_id

  def dms_deal_detailable_class
    SeeUnityImanageDealStorageDetails
  end

  def version_storage_class
    SeeUnityImanageVersionStorage
  end

  def get_base_api_url
    see_unity_instance_url + "/api/#{Doxly.config.see_unity_imanage_api_version_number}"
  end

  def see_unity_imanage_local_path
    path = "#{Rails.root.to_s}/#{Doxly.config.see_unity_imanage_hdd_storage_dir}"
    Dir.mkdir(path) unless Dir.exists?(path)
    path
  end

  def get_local_storage_path
    path = "#{see_unity_imanage_local_path}/entity-#{entity.id}"
    Dir.mkdir(path) unless Dir.exists?(path)
    path
  end
end
