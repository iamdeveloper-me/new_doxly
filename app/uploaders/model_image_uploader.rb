class ModelImageUploader < BaseAttachmentUploader
  include CarrierWave::MiniMagick

  def extension_whitelist
    %w(jpg jpeg gif png)
  end

  def file_path
    "uploads/#{model.class.to_s.underscore}/#{model.id}/#{mounted_as}"
  end
end
