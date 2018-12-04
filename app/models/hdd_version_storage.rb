class HddVersionStorage < ActiveRecord::Base
  has_one :version,         as: :version_storageable

  validates :version,       presence: true
  validates :original_path, presence: true

  alias_attribute :converted_object, :converted_path

  before_save :generate_converted
  before_destroy :clean
  after_create :generate_thumbnails

  SUPPORTED_FILE_OBJECTS = [File, Tempfile]

  def upload!(file, type = 'original')
    # error checking
    raise "Can not upload to version without an ID." unless version&.id
    raise "Invalid file object." unless SUPPORTED_FILE_OBJECTS.any?{ |klass| file.is_a?(klass)  }
    raise "Can not upload to existing storage object. Please create a new version." if (type == 'original' && original_path) || (type == 'converted' && converted_path)

    # reopen to ensure it has not been read yet
    file_to_upload = File.open(file)
    begin
      base_path = get_path
      # save file
      if type == 'original'
        self.original_path = "#{base_path}/original#{File.extname(file_to_upload).downcase}"
        File.open(original_path, "wb") { |original_file| original_file.write(file_to_upload.read) }
      else
        self.converted_path = "#{base_path}/converted.pdf"
        File.open(converted_path, "wb") { |converted_file| converted_file.write(file_to_upload.read) }
      end
      self.save
    ensure
      file_to_upload.close if file_to_upload.present?
    end
  end

  def download_path
    original_path ? original_path : nil
  end

  def view_path
    converted_path ? converted_path : nil
  end

  # needs to be here for the thumbnails
  def get_base_aws_key
    raise 'version required.' if version.nil?

    attachable = version.attachment.attachable
    key = nil
    if attachable.is_a?(Deal)
      deal_key = "deal-#{attachable.id}"
      unplaced_key = "#{deal_key}/unplaced-versions"
      key = "#{unplaced_key}/version-#{version.id}"
    else
      deal_key = "deal-#{attachable.deal.id}"
      category_key = "#{deal_key}/#{attachable.root.type.underscore.dasherize}"
      key = "#{category_key}/version-#{version.id}"
    end

    key
  end

  private

  def get_path
    raise 'version required.' if version.nil?

    attachable = version.attachment.attachable
    path = nil
    if attachable.is_a?(Deal)
      entity_path = attachable.owner_entity.hdd_entity_storage.get_path
      unplaced_path = "#{entity_path}/unplaced-versions"
      path = "#{unplaced_path}/version-#{version.id}"
    else
      entity_path = attachable.deal.owner_entity.hdd_entity_storage.get_path
      deal_path = "#{entity_path}/deal-#{attachable.deal.id}"
      category_path = "#{deal_path}/#{attachable.root.type.underscore.dasherize}"
      path = "#{category_path}/version-#{version.id}"
    end
    FileUtils.mkdir_p(path)
    path
  end

  def clean
    # delete directory and files inside
    FileUtils.rm_rf(original_path.split('/').slice(0..-2).join('/'))
  end

  def generate_converted
    if !self.converted_path
      ConvertToPdfJob.perform_later(version)
    end
  end

  def generate_thumbnails
    if File.extname(original_path).downcase == '.pdf'
      CreateThumbnailsJob.perform_later(self.version) if self.version.attachment.attachable.try(:signature_required?)
    end
  end
end
