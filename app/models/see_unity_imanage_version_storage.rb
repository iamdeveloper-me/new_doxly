class SeeUnityImanageVersionStorage < ActiveRecord::Base
  include Models::DmsVersionStorageable

  has_one :version, as: :version_storageable, inverse_of: :version_storageable, autosave: true
  has_one :cached_original_aws_file, as: :aws_fileable, dependent: :destroy, autosave: :true
  has_one :cached_converted_aws_file, as: :aws_fileable, dependent: :destroy, autosave: :true
  alias_attribute :converted_object, :cached_converted_aws_file

  validates_presence_of :version, :see_unity_imanage_version_object

  SUCCESSFULLY_UPLOADED_NEW_VERSION = "Version successfully added"
  SUCCESSFULLY_UPLOADED_NEW_DOCUMENT  = "Document successfully uploaded"

  def download
    response = api(version.uploader).download_version({ id: see_unity_imanage_version_object["VersionID"] })
    new_file_path = version.uploader.entity.dms_entity_storageable.get_local_storage_path + "/#{see_unity_imanage_version_object["Name"]}-#{SecureRandom.hex(8)}.#{file_extension}"
    File.open(new_file_path, 'wb') {|file| file.write(response)}
    new_file_path
  end

  def downloading_in_process?
    Delayed::Job.where(queue: 'download_from_dms_and_convert', failed_at: nil).where("handler LIKE '%gid://doxly/SeeUnityImanageVersionStorage/#{id}%'").any?
  end

  def create_version_from_see_unity_imanage_version_object!(attachment, entity_user)
    version = attachment.versions.new
    version.assign_attributes(
      file_name: [see_unity_imanage_version_object["document"]["Name"], file_extension].join('.'),
      file_size: see_unity_imanage_version_object["Properties"].find{|property| property["Field"] == "File Size"}["Value"],
      file_type: '.' + file_extension,
      upload_method: UPLOAD_METHOD,
      uploader: entity_user,
      status: VERSION_STATUS_DRAFT,
      status_set_at: Time.now.utc
    )
    version.bypass_tree_element_execution_check = true

    # save the version and then the version_storageable
    self.version = version
    save
  end

  def file_extension
    see_unity_imanage_version_object["Properties"].find{|property| property["Field"] == "Class"}["Value"].downcase
  end

  def send_as_new_version!(version, entity_user, options={})
    # will raise an exception and not get past this if api call doesn't work
    response = api(entity_user).create_new_version(options.merge({file_path: version.download_path}))
    if successfully_sent_to_dms?(response)
      begin
        self.see_unity_imanage_version_object = get_see_unity_imanage_version_object_from_document(entity_user, options)
        old_version_storage = version.version_storageable
        self.version = version
        save!
        old_version_storage.reload.destroy
      ensure
        # TODO: Go into iManage and destroy the newly created version if this next section of code fails. This is probably phase #2.
      end
    else
      raise "Couldn't create a new version"
    end
  end
  #
  def send_as_new_document!(version, entity_user, options={})
    response = api(entity_user).create_new_document(options.merge({ file_path: version.download_path }))
    if response["Message"] == SUCCESSFULLY_UPLOADED_NEW_DOCUMENT
      new_document_id = response["EID"]
    else
      raise response
    end
    begin
      self.see_unity_imanage_version_object = get_see_unity_imanage_version_object_from_document(entity_user, options.merge({ document_id: new_document_id }))
      old_version_storage = version.version_storageable
      self.version = version
      save!
    ensure
      # TODO: Go into NetDocs and destroy the newly created document if this next section of code fails. This is probably phase #2.
    end
  end

  def get_see_unity_imanage_version_object_from_document(entity_user, options)
    document_id     = options.fetch(:document_id, nil)
    document_object = api(entity_user).get_element_profile(id: document_id)
    raise "Couldn't find the document for see_unity_imanage_version_storage #{self.id}" unless document_object.present?
    document_versions = api(entity_user).get_versions_list({ id: URI.unescape(document_id) })
    raise "Couldn't access the versions see_unity_imanage_version_storage #{self.id}" unless document_versions.present?
    new_version = document_versions.last
    new_version["document"] = document_object
    new_version
  end

  def successfully_sent_to_dms?(response)
    response["Message"] == SUCCESSFULLY_UPLOADED_NEW_VERSION
  end

  # CURRENTLY NOT READY, WAITING ON SEEUNITY TO FIX EDIT DATE
  def sync_thumbnails(entity_user)
    document_versions         = api(entity_user).get_versions_list({ id: see_unity_imanage_version_object["document"]["EID"] })
    dms_version               = document_versions.find{ |version| version["VersionLabel"] == see_unity_imanage_version_object["VersionLabel"] }
    dms_version_edit_date     = dms_version["Properties"].find{ |property| property["Field"] == "Edit Date" }["Value"]
    doxly_version_edit_date   = see_unity_imanage_version_object["Properties"].find{|property| property["Field"] == "Edit Date"}["Value"]
    version_updated           = dms_version_edit_date != doxly_version_edit_date
    if version_updated
      cached_original_aws_file.destroy
      cached_converted_aws_file.destroy
      reload
      download_and_convert({ convert: true, synchronous_thumbnails: true })
      # TODO if ever get back to this, update see_unity_imanage_version_object first.
      updated_edit_date = see_unity_imanage_version_object["Properties"].find{|property| property["Field"] == "Edit Date"}["Value"]
      # success criteria below
      return updated_edit_date != doxly_version_edit_date
    else
      return true
    end
  end

  private

  def api(entity_user)
    # TODO I'm pretty sure this isn't caching because of the argument that has to be passed in. Figure out how to get it to.
    @api ||= SeeUnityImanageApi.new(entity_user)
  end
end
