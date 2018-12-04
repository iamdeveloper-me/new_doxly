class Imanage10VersionStorage < ActiveRecord::Base
  include Models::DmsVersionStorageable

  has_one :version, as: :version_storageable, inverse_of: :version_storageable, autosave: true
  has_one :cached_original_aws_file, as: :aws_fileable, dependent: :destroy, autosave: :true
  has_one :cached_converted_aws_file, as: :aws_fileable, dependent: :destroy, autosave: :true
  alias_attribute :converted_object, :cached_converted_aws_file

  validates_presence_of :version, :imanage10_version_object

  SEND_AS_NEW_DOCUMENT_VERSION_NUMBER = 1

  def downloading_in_process?
    Delayed::Job.where(queue: 'download_from_dms_and_convert', failed_at: nil).where("handler LIKE '%gid://doxly/Imanage10VersionStorage/#{id}%'").any?
  end

  def download
    response      = api(version.uploader).download_version(
      {
        id: imanage10_version_object["id"], # we're using the version id as the document id, since it's ignoring the version_number
        version_number: imanage10_version_object["version"] # as far as I can tell, the api is ignoring the version number sent, and is instead just going by the document id.
      }
    )
    local_path    = version.uploader.entity.dms_entity_storageable.get_local_storage_path
    document_name = imanage10_version_object["document"]["name"]
    extension     = imanage10_version_object["extension"]
    new_file_path = "#{local_path}/#{document_name}-#{SecureRandom.hex(8)}.#{extension}"
    File.open(new_file_path, 'wb') {|file| file.write(response)}
    new_file_path
  end

  def create_version_from_imanage10_version_object!(attachment, entity_user)
    version = attachment.versions.new
    version.assign_attributes(
      file_name: "#{imanage10_version_object["document"]["name"]}.#{imanage10_version_object["extension"]}",
      file_size: imanage10_version_object["document"]["size"],
      file_type: '.' + imanage10_version_object["extension"],
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

  def send_as_new_version!(version, entity_user, options={})
    document_id = options.fetch(:document_id, nil)
    # will raise an exception and not get past this if api call doesn't work
    new_version = api(entity_user).create_new_version({ document_id: URI.unescape(document_id), file_path: version.download_path })
    begin
      new_version_number = new_version["version"]
      self.imanage10_version_object = get_imanage10_version_object_from_document(entity_user, document_id, new_version_number)
      old_version_storage = version.version_storageable
      self.version = version
      save!
      old_version_storage.reload.destroy
    ensure
      # TODO: Go into iManage10 and destroy the newly created version if this next section of code fails. This is probably phase #2.
    end
  end

  def send_as_new_document!(version, entity_user, options={})
    document = api(entity_user).create_new_document(options.merge({ file_path: version.download_path }))
    begin
      self.imanage10_version_object = get_imanage10_version_object_from_document(entity_user, document["id"], SEND_AS_NEW_DOCUMENT_VERSION_NUMBER)
      old_version_storage = version.version_storageable
      self.version = version
      save!
    ensure
      # TODO: Go into iManage and destroy the newly created document if it fails while saving in Doxly. This is probably phase #2.
    end
  end

  def get_imanage10_version_object_from_document(entity_user, document_id, new_version_number)
    # this will raise an exception if it fails
    document = api(entity_user).get_versions_list({ document_id: URI.unescape(document_id) })
    new_version = document["versions"].find{|version| version["version"] == new_version_number}
    new_version["document"] = document.except("versions") # need the except here to prevent infinite nesting
    new_version
  end

  def sync_thumbnails(entity_user)
    document_id               = imanage10_version_object["id"]
    version_number            = imanage10_version_object["version"]
    dms_version               = get_imanage10_version_object_from_document(entity_user, document_id, version_number)
    dms_version_edit_date     = dms_version["file_edit_date"]
    doxly_version_edit_date   = imanage10_version_object["file_edit_date"]
    version_updated           = dms_version_edit_date != doxly_version_edit_date
    if version_updated
      cached_original_aws_file&.destroy
      cached_converted_aws_file&.destroy
      reload # destroying doesn't change cached object
      download_and_convert({ convert: true, synchronous_thumbnails: true })
      # update nd_version_object with any new info
      self.imanage10_version_object = dms_version
      save!
      # success criteria below
      updated_edit_date = imanage10_version_object["file_edit_date"]
      return updated_edit_date != doxly_version_edit_date
    else
      return true
    end
  end

  private

  def api(entity_user)
    # TODO I'm pretty sure this isn't caching because of the argument that has to be passed in. Figure out how to get it to.
    @api ||= Imanage10Api.new(entity_user)
  end
end
