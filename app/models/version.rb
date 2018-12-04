class Version < ActiveRecord::Base

  CONVERSION_ATTEMPTS = 4

  SENDING_TO_DMS_STATUSES = {
    sending: 'sending',
    failed: 'failed'
  }

  DMS_VERSION_STORAGEABLE_MODELS = [NetDocumentsVersionStorage, SeeUnityImanageVersionStorage, Imanage10VersionStorage]

  attr_accessor :bypass_file_validations
  attr_accessor :bypass_tree_element_execution_check

  acts_as_list scope: :attachment

  belongs_to :version_storageable, polymorphic: true, dependent: :destroy
  has_one    :thumbnail_storage, as: :thumbnail_storageable, dependent: :destroy
  has_one    :thumbnail_sprite, through: :thumbnail_storage
  belongs_to :attachment, :inverse_of => :versions
  belongs_to :uploader, class_name: "EntityUser"
  has_many   :events, :as => :eventable, :dependent => :destroy
  has_many   :signature_page_executions
  has_many   :executed_signature_pages, through: :signature_page_executions, source: :signature_page
  has_many   :executed_signing_capacities, through: :executed_signature_pages, source: :signing_capacity
  has_many   :conversions, as: :convertable, dependent: :destroy
  has_many   :events,      as: :eventable, dependent: :destroy

  belongs_to :executed_against_version, class_name: 'Version'
  has_many   :executed_against_me_versions, class_name: 'Version', foreign_key: :executed_against_version_id

  validates_presence_of :attachment, :uploader_id, :file_type
  validates_inclusion_of :sending_to_dms_status, in: SENDING_TO_DMS_STATUSES.values, allow_nil: true

  with_options unless: :bypass_file_validations? do |v|
    v.validates_presence_of :version_storageable
  end
  after_create   :cleanup_completion_statuses
  after_update   :cleanup_completion_statuses, if: :attachment_id_changed?
  before_destroy :check_destroy_completion_statuses
  after_destroy  :check_destroy_attachment

  scope :executed, -> { where(status: 'executed') }

  # Set these to be true if you want to update version object without setting file details.
  def bypass_file_validations?
    bypass_file_validations
  end

  def upload(file)
    # always upload to HDD first
    version_storageable = HddVersionStorage.new(version: self)
    version_storageable.upload!(file)
  end

  def download_path
    version_storageable.download_path
  end
  alias_method :original_path, :download_path

  def view_path
    version_storageable.view_path
  end

  def converted_path
    version_storageable.converted_path
  end

  def move_to_next_storage
    if version_storageable.is_a?(HddVersionStorage)
      MoveFromHddToAwsJob.perform_later(self)
    end
  end

  def is_final?
    self.status == "final"
  end

  # needs to be in version to be accessable to thumbnails as well.
  def get_base_aws_key
    attachable = attachment.attachable
    key = nil
    if attachable.is_a?(Deal)
      unplaced_key = "deal-#{attachable.id}/unplaced-versions"
      key = "#{unplaced_key}/version-#{id}"
    else
      deal_key = "deal-#{attachable.deal.id}"
      category_key = "#{deal_key}/#{attachable.root.type.underscore.dasherize}"
      key = "#{category_key}/version-#{id}"
    end

    key
  end

  def get_entity
    attachable = attachment.attachable
    if attachable.is_a?(Deal)
      attachable.owner_entity
    else
      attachable.deal.owner_entity
    end
  end

  def send_to_dms(entity_user, options={})
    raise 'File must be present on version' unless File.exist?(download_path)
    new_dms_version_storage = entity_user.entity.dms_entity_storageable.version_storage_class.new
    new_dms_version_storage.send_version_to_dms!(self, entity_user, options)
  end

  def sending_to_dms!
    self.sending_to_dms_status = SENDING_TO_DMS_STATUSES[:sending]
    save
  end

  def failed_to_send_to_dms!
    self.sending_to_dms_status = SENDING_TO_DMS_STATUSES[:failed]
    save
  end

  def successfully_sent_to_dms!
    self.sending_to_dms_status = nil
    save
  end

  def is_on_dms?
    DMS_VERSION_STORAGEABLE_MODELS.include?(version_storageable.class)
  end

  def sync_thumbnails(entity_user)
    return false unless is_on_dms?
    version_storageable.sync_thumbnails(entity_user)
  end

  private

  def check_destroy_completion_statuses
    tree_element = attachment.attachable
    if tree_element.is_a?(TreeElement) && tree_element.latest_version.id == self.id
      tree_element.completion_statuses.destroy_all
    end
  end

  def check_destroy_attachment
    attachment.destroy if attachment.versions.reload.empty?
  end

  def cleanup_completion_statuses
    tree_element = attachment.attachable
    return unless tree_element.is_a?(TreeElement)
    tree_element.completion_statuses.destroy_all
  end

end
