class AwsFile < ActiveRecord::Base

  belongs_to :entity
  belongs_to :aws_fileable, polymorphic: true

  validates_presence_of :key, :type, :entity, :aws_fileable
  validates_inclusion_of :type, :in => %w( AwsFile OriginalAwsFile ConvertedAwsFile CustomPagePreviewAwsFile ConvertedCustomPageAwsFile OriginalCustomPageAwsFile CustomPageThumbnailAwsFile CachedOriginalAwsFile CachedConvertedAwsFile UnsignedAwsFile SignedAwsFile UnmatchedPageAwsFile )
  before_save :no_expiration!
  validate :expiration_for_cache

  after_destroy :clean

  def upload(file)
    file_to_upload = File.open(file)
    begin
      # this will raise an exception if it fails. So whatever is calling this upload function should be prepared to handle
      ApplicationHelper.retry_command do
        entity.aws_entity_storage.get_bucket.put_object({
          key: key,
          body: file_to_upload.read,
          server_side_encryption: 'AES256'
        })
      end
    ensure
      file_to_upload.close if file_to_upload
    end
  end

  def path
    download_path = get_download_path
    entity.aws_entity_storage.get_bucket.object(key).download_file(download_path)
    download_path
  end

  private

  def clean
    entity.aws_entity_storage.get_bucket.object(key)&.delete
  end

  def get_download_path
    path        = tmp_file
    file_exists = File.exist?(path)
    until !file_exists
      path        = tmp_file
      file_exists = File.exist?(path)
    end
    path
  end

  def tmp_file
    [ApplicationHelper.temp_dir_root, "/aws-file-", SecureRandom.hex(4), File.extname(key)].join
  end

  def no_expiration!
    unless %w(CachedConvertedAwsFile CachedOriginalAwsFile).include?(type)
      self.has_expiration_datetime = false
      self.expiration_datetime = nil
    end
  end

  def expiration_for_cache
    if %w(CachedConvertedAwsFile CachedOriginalAwsFile).include?(type)
      errors.add(:base, 'File must be set to expire') unless has_expiration_datetime
    end
  end
end
