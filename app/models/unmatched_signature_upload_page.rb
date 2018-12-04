class UnmatchedSignatureUploadPage < ActiveRecord::Base

  ALLOWED_STATUSES    = ['unmatched', 'manually_matched', 'removed']

  belongs_to  :unmatched_signature_upload
  belongs_to  :signature_page
  has_one     :unmatched_page_aws_file, as: :aws_fileable, dependent: :destroy, autosave: true

  validates :signature_page, presence: true, if: -> { self.status == 'manually_matched' }
  validates_presence_of :unmatched_signature_upload

  scope :removed,    -> { where(status: 'removed') }
  scope :unmatched,  -> { where(status: 'unmatched') }

  def get_base_aws_key
    "deal-#{unmatched_signature_upload.deal.id}/unmatched-signature-uploads/unmatched-signature-upload-#{unmatched_signature_upload.id}"
  end

  def upload!(file)
    file_type = File.extname(file)
    self.unmatched_page_aws_file = UnmatchedPageAwsFile.new(
      aws_fileable: self,
      entity: unmatched_signature_upload.deal.owner_entity,
      key: "#{get_base_aws_key}/unmatched-page-#{id}#{file_type}"
    )
    self.unmatched_page_aws_file.upload(file)
    self.save
  end

  def manually_matched!(signature_page)
    self.status = "manually_matched"
    self.signature_page = signature_page
    save
  end

  def unmatched!
    self.status = "unmatched"
    self.signature_page = nil
    save
  end

  def removed!
    self.status = 'removed'
    save
  end

  def undo_removed!
    self.status = 'unmatched'
    self.save
  end

end
