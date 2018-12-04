class ThumbnailStorage < ActiveRecord::Base
  belongs_to :thumbnail_storageable,   polymorphic: true
  validates  :thumbnail_storageable,   presence: true
  has_one    :thumbnail_sprite, as: :aws_fileable, class_name: 'AwsFile', dependent: :destroy

  SUPPORTED_FILE_OBJECTS = [File]

  def upload_sprite!(file)
    raise "Invalid file object." unless SUPPORTED_FILE_OBJECTS.any?{ |klass| file.is_a?(klass) }

    self.thumbnail_sprite = AwsFile.new(
      aws_fileable: self,
      entity: thumbnail_storageable.get_entity,
      key: "#{thumbnail_storageable.get_base_aws_key}/sprite.png"
    )
    self.thumbnail_sprite.upload(file)
    self.save
  end

  def get_base_aws_key
    "#{thumbnail_storageable.get_base_aws_key}/thumbnails"
  end
end
