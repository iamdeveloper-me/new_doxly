class AwsVersionStorage < ActiveRecord::Base

  attr_accessor :bypass_converting_original

  has_one :version,             as: :version_storageable
  has_one :original_aws_file,   as: :aws_fileable, dependent: :destroy, autosave: true
  has_one :converted_aws_file,  as: :aws_fileable, dependent: :destroy, autosave: true

  alias_attribute :converted_object, :converted_aws_file

  validates_presence_of :version, :original_aws_file

  SUPPORTED_FILE_OBJECTS = [File, Tempfile]

  def bypass_converting_original?
    bypass_converting_original
  end

  def upload!(file, type = 'original')
    raise "Can not upload to version without an ID." unless version&.id
    raise "Invalid file object." unless SUPPORTED_FILE_OBJECTS.any?{ |klass| file.is_a?(klass) }
    raise "Can not upload to existing storage object. Please create a new version." if (type == 'original' && original_aws_file.present?) || (type == 'converted' && converted_aws_file.present?)
    entity = version.get_entity
    if type == 'original'
      self.original_aws_file = OriginalAwsFile.new(
        aws_fileable: self,
        entity: entity,
        key: "#{version.get_base_aws_key}/original#{File.extname(file)}"
      )
      self.original_aws_file.upload(file)
    else
      self.converted_aws_file = ConvertedAwsFile.new(
        aws_fileable: self,
        entity: entity,
        key: "#{version.get_base_aws_key}/converted.pdf"
      )
      self.converted_aws_file.upload(file)
    end
    self.save
  end

  def download_path
    original_aws_file.path
  end
  # allows to use convert_to_pdf code with original files already on aws.
  alias_method :original_path, :download_path

  def view_path
    converted_aws_file&.path
  end
  alias_method :converted_path, :view_path

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

end
