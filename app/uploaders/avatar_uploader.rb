class AvatarUploader < ModelImageUploader

  process :resize_to_fit => [128, 128]

end
