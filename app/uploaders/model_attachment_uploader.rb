class ModelAttachmentUploader < BaseAttachmentUploader

  def file_path
    "uploads/#{model.class.to_s.underscore}/#{model.id}/#{mounted_as}"
  end

end
