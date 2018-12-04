class EntityLogoUploader < ModelImageUploader
  def file_path
    "uploads/entities/#{model.id}/#{mounted_as}"
  end
end
