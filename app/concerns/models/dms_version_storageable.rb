module Models::DmsVersionStorageable
  extend ActiveSupport::Concern

  SUPPORTED_FILE_OBJECTS = [File, Tempfile]
  SUPPORTED_AWS_FILE_TYPES = {
    cached_original: 'original',
    cached_converted: 'converted'
  }

  FILE_TYPE_EXTENSIONS = {
    pdf: '.pdf'
  }

  SAVE_AS_TYPES = {
    new_document: 'new_document',
    new_version: 'new_version'
  }

  UPLOAD_METHOD = 'dms'
  VERSION_STATUS_DRAFT = 'draft'

  def upload!(file, type = SUPPORTED_AWS_FILE_TYPES[:cached_original])
    raise "Type must be supported" unless SUPPORTED_AWS_FILE_TYPES.values.include?(type)
    raise "Can not upload to version without an ID." unless version&.id
    raise "Invalid file object." unless SUPPORTED_FILE_OBJECTS.any?{ |klass| file.is_a?(klass) }
    raise "Can not upload to existing storage object. Please create a new version." if (type == SUPPORTED_AWS_FILE_TYPES[:cached_original] && cached_original_aws_file.present?) || (type == SUPPORTED_AWS_FILE_TYPES[:cached_converted] && cached_converted_aws_file.present?)
    entity = version.get_entity
    document_retention_minutes_duration = entity.dms_entity_storageable.document_retention_minutes_duration
    if type == SUPPORTED_AWS_FILE_TYPES[:cached_original]
      self.cached_original_aws_file = CachedOriginalAwsFile.new(
        aws_fileable: self,
        entity: entity,
        key: "#{get_base_aws_key}/original#{File.extname(file)}",
        has_expiration_datetime: true,
        expiration_datetime: document_retention_minutes_duration ? Time.now.utc + (document_retention_minutes_duration * 60) : nil
      )
      self.cached_original_aws_file.upload(file)
    else
      self.cached_converted_aws_file = CachedConvertedAwsFile.new(
        aws_fileable: self,
        entity: entity,
        key: "#{get_base_aws_key}/converted.pdf",
        has_expiration_datetime: true,
        expiration_datetime: document_retention_minutes_duration ? Time.now.utc + (document_retention_minutes_duration * 60) : nil
      )
      self.cached_converted_aws_file.upload(file)
    end
    self.save
  end

  def set_cached_as_original!
    entity = version.get_entity
    document_retention_minutes_duration = entity.dms_entity_storageable.document_retention_minutes_duration
    self.cached_converted_aws_file = CachedConvertedAwsFile.new(
      aws_fileable: self,
      entity: entity,
      key: "#{get_base_aws_key}/original.pdf",
      has_expiration_datetime: true,
      expiration_datetime: document_retention_minutes_duration ? Time.now.utc + (document_retention_minutes_duration * 60) : nil
    )
    self.save
  end

  def download_path
    download_and_convert unless cached_original_aws_file
    cached_original_aws_file.path
  end
  alias_method :original_path, :download_path # allows to use convert_to_pdf code with original files already on aws.

  def view_path
    unless cached_converted_aws_file
      if !cached_original_aws_file
        download_and_convert({ convert: true })
      else
        generate_converted
      end
    end
    cached_converted_aws_file&.path
  end
  alias_method :converted_path, :view_path

  def download_and_convert(options={})
    convert                = options.fetch(:convert, false)
    synchronous_thumbnails = options.fetch(:synchronous_thumbnails, false)
    # download
    begin
      file_path = ApplicationHelper.retry_command do
        self.download
      end
      file = File.open(file_path)
      upload!(file)
      # convert
      generate_converted({ synchronous_thumbnails: synchronous_thumbnails }) if convert && !cached_converted_aws_file
    ensure
      file.close if file
      File.unlink(file) if file
    end
  end

  def generate_converted(options={})
    return unless !cached_converted_aws_file
    synchronous_thumbnails = options.fetch(:synchronous_thumbnails, false)
    if File.extname(cached_original_aws_file.path) == FILE_TYPE_EXTENSIONS[:pdf]
      set_cached_as_original!
    else
      ConvertToPdfJob.new.perform(version, { synchronous_thumbnails: synchronous_thumbnails })
    end
  end

  def get_base_aws_key
    raise 'version required.' if version.nil?

    attachable = version.attachment.attachable
    temp_key = "temp"
    deal_key = "#{temp_key}/deal-#{attachable.deal.id}"
    category_key = "#{deal_key}/#{attachable.root.type.underscore.dasherize}"
    "#{category_key}/version-#{version.id}"
  end

  def send_version_to_dms!(version, entity_user, options={})
    save_as_type = options.fetch(:save_as_type, nil)
    raise 'Must save as either a new document or a new version' unless SAVE_AS_TYPES.values.include?(save_as_type)
    if save_as_type == SAVE_AS_TYPES[:new_version]
      send_as_new_version!(version, entity_user, options)
    elsif save_as_type == SAVE_AS_TYPES[:new_document]
      send_as_new_document!(version, entity_user, options)
    end
  end

end
