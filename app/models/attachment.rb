class Attachment < ActiveRecord::Base
  belongs_to :attachable, polymorphic: true
  has_many :versions, -> { order('versions.position asc') }, dependent: :destroy, :inverse_of => :attachment
  has_one :latest_version, -> {order('versions.position desc')}, class_name: "Version"

  validates_presence_of :attachable
  validate :moved_within_same_deal, on: :update

  before_save   :validate_version_presence
  after_update  :check_cleanup_completion_statuses

  def upload!(file, entity_user, options={})
    upload_method = options.fetch(:upload_method, "upload")
    filename = options.fetch(:filename, nil)
    status = options.fetch(:status, "draft")

    if file.present?
      success  = true
      filename ||= file.original_filename
      # create version
      version = versions.new
      version.assign_attributes(
        file_name: ApplicationHelper.sanitize_filename(filename),
        file_size: file.size,
        file_type: ApplicationHelper.sanitize_filename(File.extname(filename).downcase),
        upload_method: upload_method,
        uploader: entity_user,
        status: status,
        status_set_at: Time.now.utc
      )
      version.bypass_file_validations = true
      version.bypass_tree_element_execution_check = true

      # need to save it here to get the version id
      if self.save
        if version.save
          # save uploaded file
          if !version.upload(file.is_a?(ActionDispatch::Http::UploadedFile) ? file.tempfile : file)
            success = false
          end
        else
          success = false
        end
      else
        success = false
      end

      unless success
        errors.add(:base, "File could not be uploaded")
      end
    else
      errors.add(:base, "File cannot be blank")
    end
  end

  def is_final?
    self.latest_version&.status == "final"
  end

  def is_executed?
    versions.pluck(:status).include?('executed')
  end

  def check_cleanup_completion_statuses
    if attachable_id_changed? && attachable_type === 'TreeElement'
      attachable.completion_statuses.destroy_all
    end
  end

  private

  def validate_version_presence
    return if self.versions.length > 0
    errors.add(:base, "File could not be uploaded")
    false
  end

  def moved_within_same_deal
    return if self.attachable_id_was == self.attachable_id && self.attachable_type_was == self.attachable_type
    return unless self.attachable_type_was == 'Deal' && Deal.find_by(id: attachable_id_was).present?
    errors.add(:attachable, :must_be_in_the_same_deal) if TreeElement.find(attachable_id).deal != Deal.find(attachable_id_was)
  end

end
