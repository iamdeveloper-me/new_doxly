require 'barby'
require 'barby/barcode/qr_code'
require 'barby/outputter/png_outputter'

class SignaturePage < ActiveRecord::Base

  # multiplers to get the location of the placeholders based on the font-size as flex is not supported by our PDF generator
  NAME_PLACEHOLDER_MULTIPLIER        = 0.17
  TITLE_PLACEHOLDER_MULTIPLIER       = 0.44
  DATE_SIGNED_PLACEHOLDER_MULTIPLIER = 0.27
  ADDRESS_PLACEHOLDER_MULTIPLIER     = 0.23

  SUPPORTED_CUSTOM_PAGE_FORMATS      = ['.pdf', '.doc', '.docx']
  ALLOWED_SIGNATURE_STATUSES         = ['not_sent', 'declined', 'sending', 'generating_link', 'generating_download', 'awaiting_signature', 'link_ready', 'download_ready', 'opened', 'signed']
  NOT_SENT_SIGNATURE_STATUSES        = ['not_sent', 'sending', 'generating_link', 'generating_download']
  SENDING_SIGNATURE_STATUSES         = ['sending', 'generating_link', 'generating_download']
  READY_SIGNATURE_STATUSES           = ['awaiting_signature', 'link_ready', 'download_ready', 'opened']
  SIGNED_SIGNATURE_STATUSES          = ['signed', 'declined', 'executed']
  DUMMY_QR_CODE_VALUE                = 'DO NOT SIGN'
  DUMMY_CUSTOM_CODE_VALUE            = 'CUSTOM'

  PACKET_TYPE_READY_SIGNATURE_STATUS_MAPPING = {
    email: 'awaiting_signature',
    link: 'link_ready',
    download: 'download_ready'
  }

  PACKET_TYPE_SENDING_SIGNATURE_STATUS_MAPPING = {
    email: 'sending',
    link: 'generating_link',
    download: 'generating_download'
  }

  belongs_to :signature_page_collection
  belongs_to :signing_capacity

  delegate   :user, to: :signing_capacity

  has_many :signature_packet_signature_page_collection, through: :signature_page_collection
  has_one  :signature_packet, through: :signature_packet_signature_page_collection
  has_one  :tree_element_signature_group, through: :signature_page_collection
  has_one  :tree_element, through: :signature_page_collection
  has_many :signature_tabs, dependent: :destroy
  has_one  :unsigned_aws_file, as: :aws_fileable, dependent: :destroy, autosave: true
  has_one  :signed_aws_file, as: :aws_fileable, dependent: :destroy, autosave: true
  has_one  :original_custom_page_aws_file, as: :aws_fileable, dependent: :destroy, autosave: true
  has_one  :converted_custom_page_aws_file, as: :aws_fileable, dependent: :destroy, autosave: true
  has_one  :custom_page_preview_aws_file, as: :aws_fileable, dependent: :destroy, autosave: true
  has_one  :custom_page_thumbnail_aws_file, as: :aws_fileable, dependent: :destroy, autosave: true
  has_one  :thumbnail_storage, as: :thumbnail_storageable, dependent: :destroy
  has_one  :thumbnail_sprite, through: :thumbnail_storage
  has_many :signature_page_executions, dependent: :destroy
  has_many :executed_versions, through: :signature_page_executions, source: :version
  has_one  :unmatched_signature_upload_page
  has_many :conversions, :as => :convertable, :dependent => :destroy
  has_one  :signature_entity, through: :signing_capacity
  has_one  :signature_group, through: :signing_capacity

  validates_presence_of :signing_capacity
  validate              :can_exclude
  validates             :signature_status, inclusion: { in: ALLOWED_SIGNATURE_STATUSES }

  default_scope { where(is_enabled: true) }

  scope :manual,              -> { joins(:tree_element_signature_group => :tree_element).where("tree_elements.sign_manually = ?", true) }
  scope :docusign,            -> { joins(:tree_element_signature_group => :tree_element).where("tree_elements.sign_manually = ?", false) }
  scope :incomplete,          -> { where.not(signature_status: ['signed', 'declined']) }
  scope :opened,              -> { where(signature_status: 'opened') }
  scope :ready_to_send,       -> { where(signature_status: 'not_sent') }
  scope :executable,          -> { where(signature_status: 'signed') }
  scope :awaiting_signature,  -> { where(signature_status: 'awaiting_signature') }
  scope :sent,                -> { where.not(signature_status: ['not_sent', 'sending']) }
  scope :using_template,      -> { where(use_template: true) }
  scope :ever_executed,       -> { joins(:signature_page_executions) }

  around_save :send_voting_threshold_email

  def block_collection
    signing_capacity.get_block_collection
  end

  def get_block
    if signature_entity.present?
      signature_entity.root.block
    else
      signing_capacity.block
    end
  end

  def generate_custom_page_qr_code(custom_page)
    custom_page.path
  end

  def is_manual?
    tree_element.sign_manually?
  end

  def is_docusign?
    !tree_element.sign_manually?
  end

  def is_signed?
    signature_status == 'signed'
  end

  def complete?
    ["signed", "declined"].include?(signature_status)
  end

  def sent?
    signature_status != 'not_sent'
  end

  def sending?
    SENDING_SIGNATURE_STATUSES.include? signature_status
  end

  def reset_signature_page_to_non_custom
    # remove the unsigned custom page file
    self.unsigned_aws_file.destroy
    # remove all custom page files
    self.original_custom_page_aws_file.destroy if self.original_custom_page_aws_file.present?
    self.converted_custom_page_aws_file.destroy if self.converted_custom_page_aws_file.present?
    self.custom_page_preview_aws_file.destroy if self.custom_page_preview_aws_file.present?
    self.custom_page_thumbnail_aws_file.destroy if self.custom_page_thumbnail_aws_file.present?

    # clear the attributes
    self.file_size = nil
    self.file_type = nil
    # set to not custom and not use template.
    self.is_custom    = false
    self.use_template = false
    # save
    self.save
    # destroy all the associated tabs
    self.signature_tabs.destroy_all
  end

  def copy_custom_page(page_to_copy)
    # download page_to_copy's unsigned aws file
    copied_unsigned_page = File.open(page_to_copy.unsigned_aws_file.path)
    self.is_custom    = true
    self.use_template = page_to_copy.use_template

    # upload to aws
    # we have to check if the original is present because `choose from document` pages do not have an original
    self.upload!(copied_unsigned_page)
    self.upload!(page_to_copy.original_custom_page_aws_file.path, 'original_custom_page') if page_to_copy.original_custom_page_aws_file.present?
    self.upload!(page_to_copy.converted_custom_page_aws_file.path, 'converted_custom_page')
    self.upload!(page_to_copy.custom_page_preview_aws_file.path, 'custom_page_preview')
    self.upload!(page_to_copy.custom_page_thumbnail_aws_file.path, 'custom_page_thumbnail')

    # copy tabs
    page_to_copy.signature_tabs.each do |tab|
      dup_tab = tab.dup
      dup_tab.signature_page_id = self.id
      dup_tab.save
    end
  end

  def get_base_aws_key
    "deal-#{tree_element.deal.id}/signature-management/signature-pages/signature-page-#{id}"
  end

  def get_entity
    tree_element.deal.owner_entity
  end

  def upload!(file, type = 'unsigned')
    raise 'Need ID to upload. Please save the signature page first.' if !id
    case type
    when 'unsigned'
      self.file_type = File.extname(file)
      self.file_size = File.size(file)
      self.unsigned_aws_file = UnsignedAwsFile.new(
        aws_fileable: self,
        entity: tree_element.deal.owner_entity,
        key: "#{get_base_aws_key}/unsigned-signature-page#{file_type}"
      )
      self.unsigned_aws_file.upload(file)
    when 'signed'
      self.signed_file_type = File.extname(file)
      self.signed_file_size = File.size(file)
      self.signed_aws_file = SignedAwsFile.new(
        aws_fileable: self,
        entity: tree_element.deal.owner_entity,
        key: "#{get_base_aws_key}/signed-signature-page#{file_type}"
      )
      self.signed_aws_file.upload(file)
      CreateThumbnailsJob.perform_later(self) # will not run if upload fails
    when 'original_custom_page'
      self.original_custom_page_aws_file.destroy if self.original_custom_page_aws_file.present?
      self.original_custom_page_aws_file = OriginalCustomPageAwsFile.new(
        aws_fileable: self,
        entity: tree_element.deal.owner_entity,
        key: "#{get_base_aws_key}/custom-signature-page#{File.extname(file)}"
      )
      self.original_custom_page_aws_file.upload(file)
    when 'custom_page_preview'
      self.custom_page_preview_aws_file.destroy if self.custom_page_preview_aws_file.present?
      self.custom_page_preview_aws_file = CustomPagePreviewAwsFile.new(
        aws_fileable: self,
        entity: tree_element.deal.owner_entity,
        key: "#{get_base_aws_key}/custom-signature-page-preview#{File.extname(file)}"
      )
      self.custom_page_preview_aws_file.upload(file)
    when 'custom_page_thumbnail'
      self.custom_page_thumbnail_aws_file.destroy if self.custom_page_thumbnail_aws_file.present?
      self.custom_page_thumbnail_aws_file = CustomPageThumbnailAwsFile.new(
        aws_fileable: self,
        entity: tree_element.deal.owner_entity,
        key: "#{get_base_aws_key}/custom-signature-page-thumbnail#{File.extname(file)}"
      )
      self.custom_page_thumbnail_aws_file.upload(file)
    when 'converted_custom_page'
      self.converted_custom_page_aws_file.destroy if self.converted_custom_page_aws_file.present?
      self.converted_custom_page_aws_file = ConvertedCustomPageAwsFile.new(
        aws_fileable: self,
        entity: tree_element.deal.owner_entity,
        key: "#{get_base_aws_key}/converted-custom-signature-page#{File.extname(file)}"
      )
      self.converted_custom_page_aws_file.upload(file)
    end

    self.save
  end

  def unsigned_file_path
    unsigned_aws_file&.path
  end

  def signed_file_path
    signed_aws_file&.path
  end

  def view_path
    unsigned_file_path
  end

  def currently_executed?
    return if !tree_element.attachment
    last_executed_version = executed_versions.last
    last_executed_version && (last_executed_version == tree_element.currently_executed_version)
  end

  def is_part_of_multiple?
    signature_entity.all_signing_capacities.length > 1 if signature_entity
  end

  def unique_key
    return nil unless file_page_to_sign
    signature_page_collection.unique_key + file_page_to_sign.to_s
  end

  def awaiting_signature!
    self.signature_status = "awaiting_signature"
    self.signature_status_timestamp = signature_page_collection.signature_packet.sent_at
    signed_aws_file.destroy if signed_aws_file
    save
  end

  def signed!(path)
    if upload!(path, 'signed')
      update(signature_status: 'signed', signature_status_timestamp: Time.now.utc) if signature_status != 'signed'
    else
      raise("Could not upload the signed signature page to page #{id}")
    end
    save
  end

  def sending!
    set_signature_status(PACKET_TYPE_SENDING_SIGNATURE_STATUS_MAPPING[signature_packet.packet_type.to_sym])
  end

  def ready!
    set_signature_status(PACKET_TYPE_READY_SIGNATURE_STATUS_MAPPING[signature_packet.packet_type.to_sym])
  end

  def signature_packet
    signature_page_collection.signature_packet
  end

  def has_linked_blocks?
    block_collection.blocks.length > 1
  end

  def set_file_page_to_sign!(page_number)
    self.file_page_to_sign = page_number
    save!
  end

  # TODO move all of the custom pages code to the model so that this isn't mostly duplicated. For now, just doing so that don't have to completely re-write custom pages.
  def add_qr_code_to_pdf(deal_signature_pages_base, page_number)
    begin
      if converted_custom_page_aws_file.present?
        image_file_path = deal_signature_pages_base + "/custom_signature_page_#{self.id}_image.jpg"
        pdf_file_path = deal_signature_pages_base + "custom_signature_page_#{self.id}_ready_to_send.pdf"
        # save the page as a JPG
        custom_page_img = ApplicationHelper.im_image_from_path(self.converted_custom_page_aws_file.path, { do_cleanup: false }) do |image|
          image.write(image_file_path)
        end
        # generate the qr code and add it to the image
        deal = block_collection.signature_group.deal
        qr_code_img_path = signature_page_collection.generate_qr_code("#{ApplicationHelper.signature_management_root}/deal_#{deal.id}",{ page_number: page_number })
        ApplicationHelper.retry_command do
          ApplicationHelper.im_image_from_path(qr_code_img_path, { set_resolution: false, set_background: false }) do |image|
            image.write(image_file_path)
            resized_image      = image.resize(170, 170).extent(200, 200, -15, -15).border(3, 3, "black")
            image_with_qr_code = custom_page_img.composite(resized_image, Magick::SouthEastGravity, 100, 100, Magick::OverCompositeOp)
            image_with_qr_code.write(pdf_file_path)
            # clean up
            resized_image.destroy!
            image_with_qr_code.destroy!
          end
        end
      # This code is to support previous custom pages that added the qr code BEFORE the sending process.
      # There's no way to generate converted_custom_aws_files for these legacy pages, we will just check against this date, which in our DB is the newest custom pages without a converted_custom_page_aws_file,
      # We'll just remove in 6 months or something once we're sure we don't need to support old pages.
      else
        deal_signature_pages_base = "#{ApplicationHelper.signature_management_root}/deal_#{tree_element.deal.id}/signature_pages"
        pdf_file_path = deal_signature_pages_base + "/custom_unsigned_signature_page_#{id}.pdf"
        FileUtils.mv(unsigned_file_path, pdf_file_path)
      # else
      #   # something went terribly wrong, we don't have the converted_custom_page, and it's not an old page.
      #   return false
      end
      pdf_file_path
    rescue StandardError => e
      return false
    ensure
      File.delete(qr_code_img_path) if qr_code_img_path && File.exist?(qr_code_img_path)
      # We need to clean up this code so it doesn't leave files sitting around on the HDD, but for now other code expects this file to be there
      # File.delete(custom_page_img.filename) if File.exist?(custom_page_img.filename)
    end
  end

  private

  def can_exclude
    if is_enabled_changed? && !is_enabled && sent?
      errors.add(:is_enabled, :cannot_exclude)
    end
  end

  def set_signature_status(status)
    is_ready_signature_status = READY_SIGNATURE_STATUSES.include?(status)
    self.signature_status = status
    self.signature_status_timestamp = is_ready_signature_status ? signature_page_collection.signature_packet.sent_at : Time.now.utc
    signed_aws_file.destroy if signed_aws_file && is_ready_signature_status
    save
  end

  def send_voting_threshold_email
    return yield unless signature_status_changed? && signature_status == 'signed'
    document = tree_element.becomes(Document)
    threshold_was_met = document.are_voting_interest_thresholds_complete?
    return yield if threshold_was_met
    yield
    threshold_is_met = document.are_voting_interest_thresholds_complete?
    return unless threshold_is_met
    document.deal.owner_entity_users.each do |user|
      DealMailer.threshold_met_email(user, document).deliver_later
    end
  end
end
