class BaseAttachmentUploader < CarrierWave::Uploader::Base
  # Choose what kind of storage to use for this uploader:

  storage :fog

  # Override the directory where uploaded files will be stored.
  # This is a sensible default for uploaders that are meant to be mounted:
  def store_dir
    file_path
  end

  def public_filename
    File.basename(file.path).split(/\?/).first
  end

  def filename
    if file.present? && model.try(:attachment_filename).present?
      model.attachment_filename 
    else
      super
    end
  end

  def download_url
    file.url({ :query => { 'response-content-disposition' => 'attachment' } })
  end

  def full_url
    if file.is_a? CarrierWave::SanitizedFile
      file.path
    else
      download_url
    end
  end

end
