class NetDocumentsVersionStorage < ActiveRecord::Base
  include Models::DmsVersionStorageable

  has_one :version, as: :version_storageable, inverse_of: :version_storageable, autosave: true
  has_one :cached_original_aws_file, as: :aws_fileable, dependent: :destroy, autosave: :true
  has_one :cached_converted_aws_file, as: :aws_fileable, dependent: :destroy, autosave: :true
  alias_attribute :converted_object, :cached_converted_aws_file

  validates_presence_of :version, :nd_version_object

  def downloading_in_process?
    Delayed::Job.where(queue: 'download_from_dms_and_convert', failed_at: nil).where("handler LIKE '%gid://doxly/NetDocumentsVersionStorage/#{id}%'").any?
  end

  def download
    response      = api(version.uploader).download_version({id: nd_version_object["document"]["envId"], version_number: nd_version_object["number"]})
    local_path    = version.uploader.entity.dms_entity_storageable.get_local_storage_path
    document_name = nd_version_object["document"]["name"]
    extension     = nd_version_object["extension"]
    new_file_path = local_path + "/#{document_name}-#{SecureRandom.hex(8)}.#{extension}"
    File.open(new_file_path, 'wb') {|file| file.write(response)}
    new_file_path
  end

  def create_version_from_nd_version_object!(attachment, entity_user)
    version = attachment.versions.new
    version.assign_attributes(
      file_name: [nd_version_object["document"]["name"], nd_version_object["extension"]].join('.'),
      file_size: nd_version_object["document"]["size"],
      file_type: '.' + nd_version_object["extension"],
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
    new_version_number = api(entity_user).create_new_version({ id: URI.unescape(document_id), file_path: version.download_path })
    begin
      self.nd_version_object = get_nd_version_object_from_document(entity_user, document_id, new_version_number)
      old_version_storage = version.version_storageable
      self.version = version
      save!
    ensure
      # TODO: Go into NetDocs and destroy the newly created version if this next section of code fails. This is probably phase #2.
    end
    old_version_storage.reload.destroy
  end

  def send_as_new_document!(version, entity_user, options={})
    new_document_id = api(entity_user).create_new_document(options.merge({ file_path: version.download_path }))
    begin
      self.nd_version_object = get_nd_version_object_from_document(entity_user, new_document_id, "1")
      old_version_storage = version.version_storageable
      self.version = version
      save!
    ensure
      # TODO: Go into NetDocs and destroy the newly created document if this next section of code fails. This is probably phase #2.
    end
  end

  def get_nd_version_object_from_document(entity_user, document_id, new_version_number)
    # this will raise an exception if it fails
    document_with_versions = api(entity_user).get_document({ id: URI.unescape(document_id) })
    new_version = document_with_versions["docVersions"]["version"].select{ |x| x["number"] == new_version_number }.first
    new_version["document"] = document_with_versions["standardAttributes"]
    new_version
  end

  def sync_thumbnails(entity_user)
    document_id               = nd_version_object["document"]["id"]
    version_number            = nd_version_object["number"]
    dms_version               = get_nd_version_object_from_document(entity_user, document_id, version_number)
    dms_version_edit_date     = dms_version["modified"]
    doxly_version_edit_date   = nd_version_object["modified"]
    version_updated           = dms_version_edit_date != doxly_version_edit_date
    if version_updated
      cached_original_aws_file&.destroy
      cached_converted_aws_file&.destroy
      reload # destroying doesn't change cached object
      download_and_convert({ convert: true, synchronous_thumbnails: true })
      # update nd_version_object with any new info
      self.nd_version_object = dms_version
      save!
      # success criteria below
      updated_edit_date = nd_version_object["modified"]
      return updated_edit_date != doxly_version_edit_date
    else
      return true
    end
  end

  private

  def api(entity_user)
    # TODO I'm pretty sure this isn't caching because of the argument that has to be passed in. Figure out how to get it to.
    @api ||= NetDocumentsApi.new(entity_user)
  end
end
