class ClosingBookLogoUploader < ModelImageUploader

  process :resize_to_limit => [200, 0]

  def file_path
    "uploads/#{model.deal.class.to_s.underscore}/#{model.deal.id}/#{model.class.to_s.underscore}/#{model.id}/#{mounted_as}"
  end
end
