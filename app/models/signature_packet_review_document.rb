class SignaturePacketReviewDocument < ActiveRecord::Base

  CONVERSION_ATTEMPTS = 4

  belongs_to :signature_packet
  belongs_to :tree_element
  has_one    :original_aws_file, as: :aws_fileable, dependent: :destroy, autosave: true
  has_one    :converted_aws_file, as: :aws_fileable, dependent: :destroy, autosave: true
  has_many   :conversions, :as => :convertable, :dependent => :destroy

  validates_presence_of :signature_packet
  validate :cannot_have_both_aws_file_and_tree_element
  validates_uniqueness_of :tree_element_id, allow_blank: true, scope: :signature_packet_id
  before_save :sanitize_file_name

  # name to display when reviewing the documents.
  def name
    tree_element&.name || file_name
  end

  def cannot_have_both_aws_file_and_tree_element
    if original_aws_file && tree_element
      errors.add(:tree_element, :cannot_be_present_with_aws_file)
    end
  end

  def upload!(file, type='original')
    raise 'Need ID to upload. Please save the signature packet review document first.' unless id
    if type == 'original'
      self.file_name = file_name || File.basename(file.path)
      self.file_type = File.extname(file)
      self.original_aws_file = OriginalAwsFile.new(
        aws_fileable: self,
        entity: signature_packet.deal.owner_entity,
        key: "#{get_base_aws_key}/original#{file_type}"
      )
      self.original_aws_file.upload(file)
    else
      self.converted_aws_file = ConvertedAwsFile.new(
        aws_fileable: self,
        entity: signature_packet.deal.owner_entity,
        key: "#{get_base_aws_key}/converted#{file_type}"
      )
      self.converted_aws_file.upload(file)
    end
    self.save
    generate_converted unless type == 'converted'
  end

  def get_base_aws_key
    "deal-#{signature_packet.deal.id}/signature-management/signature-packet-#{signature_packet.id}/signature-packet-review-document-#{id}"
  end

  def view_path
    if tree_element
      tree_element.latest_version&.view_path
    else
      converted_aws_file.path
    end
  end

  def download_path
    if tree_element
      tree_element.latest_version&.download_path
    else
      original_path
    end
  end

  def original_path
    original_aws_file&.path
  end

  def generate_converted
    if file_type == '.pdf'
      ConvertedAwsFile.create(
        aws_fileable: self,
        entity: signature_packet.deal.owner_entity,
        key: "#{get_base_aws_key}/original#{file_type}"
      )
    else
      ConvertToPdfJob.perform_later(self)
    end
  end

  def sanitize_file_name
    return true unless file_name
    sanitized_file_name_array = file_name.split('.')
    sanitized_file_name_array.pop if sanitized_file_name_array.length > 1
    self.file_name = sanitized_file_name_array.join('.').tr('-_', ' ').split.map(&:capitalize)*' '
  end

end
