class SignaturePacket < ActiveRecord::Base
  include Models::Signable

  REMINDER_WAIT_TIME        = 60
  ALLOWED_FILE_UPLOAD_TYPES = [".jpeg", ".jpg", ".pdf", ".png", ".tif", ".tiff"]
  ALLOWED_STATUSES          = ['opened', 'signed', 'declined']
  ALLOWED_PACKET_TYPES      = ['email', 'link', 'download']
  
  DOCUSIGN_STATUS_MAPPING   = {
    sent: "sent",
    voided: "voided",
    declined: "declined",
    completed: "completed"
  }

  attr_accessor :bypass_approval_validation

  belongs_to :deal
  belongs_to :user
  belongs_to :sent_by_entity_user, :class_name => 'EntityUser', :foreign_key => :sent_by_user_id
  has_many   :signature_packet_signature_page_collections, dependent: :destroy
  has_many   :signature_page_collections, through: :signature_packet_signature_page_collections
  has_many   :signature_packet_review_documents, dependent: :destroy
  has_many   :signature_pages, through: :signature_page_collections
  has_many   :tree_elements, through: :signature_page_collections
  has_many   :signing_capacities, through: :signature_pages
  has_many   :esignature_notifications, :dependent => :destroy
  has_one    :unsigned_aws_file, as: :aws_fileable, dependent: :destroy, autosave: true
  has_one    :signed_aws_file, as: :aws_fileable, dependent: :destroy, autosave: true

  scope :sent, -> { where.not(sent_at: nil) }
  scope :without_download_type, -> { where.not(packet_type: 'download') }
  scope :with_email_type, -> { where(packet_type: 'email') }

  validates_presence_of :user, :deal
  validates             :packet_type, inclusion: { in: ALLOWED_PACKET_TYPES }

  before_create :cleanup_packet_email_options

  def bypass_approval_validation?
    bypass_approval_validation
  end

  def get_tree_elements
    signature_pages.map{ |page| page.tree_element }.uniq
  end

  def send_to_docusign(signature_packet_file_path, signature_page_collection_objects, notifications_url)
    begin
      esignature_provider = self.deal.owner_entity.esignature_provider
      if esignature_provider
        esignature_provider.create_envelope_from_document(signature_packet_file_path, self, signature_page_collection_objects, notifications_url)
      else
        { envelope_id: nil, response: "Docusign account not specified" }
      end
    rescue StandardError => e
      { envelope_id: nil, response: e }
    end
  end

  def add_document_to_packet_on_docusign(signature_page_collection, number_of_pages_in_the_file, file_path)
    begin
      return { success: false, response: 'No envelope present' } unless self.docusign_envelope_id
      esignature_provider = self.deal.owner_entity.esignature_provider
      esignature_provider.add_envelope_document_with_tabs(self, signature_page_collection, number_of_pages_in_the_file, file_path)
    rescue StandardError => e
      { success: false, response: e }
    end
  end

  def void(owning_entity)
    if docusign_envelope_id
      owning_entity.esignature_provider.void_envelope(docusign_envelope_id)
    end

    # clean up custom pages
    self.signature_pages.where(is_custom: true).each do |custom_signature_page|
      custom_signature_page.assign_attributes({
        signature_status: 'not_sent',
        signature_status_timestamp: Time.now.utc,
        signed_file_size: nil,
        signed_file_type: nil,
        packet_page_number: nil,
        file_page_to_sign: nil
      })
      custom_signature_page.signed_aws_file.destroy unless custom_signature_page.signed_aws_file.nil?
      custom_signature_page.save
      custom_signature_page.unmatched_signature_upload_page.unmatched! if custom_signature_page.unmatched_signature_upload_page
    end

    # clean up generated pages
    self.signature_pages.where.not(is_custom: true).each do |signature_page|
      signature_page.assign_attributes({
        signature_status: 'not_sent',
        signature_status_timestamp: Time.now.utc,
        file_size: nil,
        file_type: nil,
        signed_file_size: nil,
        signed_file_type: nil,
        packet_page_number: nil,
        file_page_to_sign: nil
      })
      signature_page.unsigned_aws_file.destroy unless signature_page.unsigned_aws_file.nil?
      signature_page.signed_aws_file.destroy unless signature_page.signed_aws_file.nil?
      signature_page.save
      signature_page.unmatched_signature_upload_page.unmatched! if signature_page.unmatched_signature_upload_page
    end

    # destroy all thumbnail_storages and thumbnail sprites
    self.signature_pages.joins(:thumbnail_storage).map{|signature_page| signature_page.thumbnail_storage.destroy}

    # suicide (National Suicide Prevention Lifeline: 1-800-273-8255)
    self.destroy
  end

  def is_signed?
    # we cannot use completed_at as the manual signatures job pushes the signed pages to the
    # signature_packet signed_aws_file as they come in and when all pages are signed, marks the packet as complete
    self.signed_aws_file.present?
  end

  def upload_batch_path(batch_id)
    "#{ApplicationHelper.signature_management_root}/deal_#{deal.id}/manual_signatures/signature_packet_#{id}/batch_#{batch_id}"
  end

  # cuts down on waiting for docusign to send back the envelope
  def all_pages_signed?
    signature_pages.any? && signature_pages.all?{|page| page.complete?}
  end

  def missing_pages_count
    signature_pages.count - signature_pages.select{ |page| page.complete? }.count
  end

  def upload!(file, type = 'unsigned')
    raise 'Need ID to upload. Please save the signature packet first.' unless id

    if type == 'unsigned'
      self.file_type = File.extname(file)
      self.file_size = File.size(file)
      self.unsigned_aws_file = UnsignedAwsFile.new(
        aws_fileable: self,
        entity: deal.owner_entity,
        key: "#{get_base_aws_key}/unsigned-signature-packet#{file_type}"
      )
      self.unsigned_aws_file.upload(file)
    else
      self.signed_file_type = File.extname(file)
      self.signed_file_size = File.size(file)
      self.signed_aws_file = SignedAwsFile.new(
        aws_fileable: self,
        entity: deal.owner_entity,
        key: "#{get_base_aws_key}/signed-signature-packet#{file_type}"
      )
      self.signed_aws_file.upload(file)
    end
    self.bypass_approval_validation = true
    self.save
  end

  def get_base_aws_key
    "deal-#{deal.id}/signature-management/signature-packet-#{id}"
  end

  def unsigned_file_path
    unsigned_aws_file&.path
  end

  def signed_file_path
    signed_aws_file&.path
  end

  def update_signature_page_statuses!(incoming_status)
    # update the signature pages
     statuses_map = HashWithIndifferentAccess.new(
      'decline': 'declined',
      'signing_complete': 'signed'
    )

    mapped_status = statuses_map[incoming_status]
    if mapped_status && ALLOWED_STATUSES.include?(mapped_status)
      self.signature_pages.each do |page|
        page.signature_status            = mapped_status || page.signature_status
        page.signature_status_timestamp  = Time.now.utc
        page.save
      end

      # update the notification
      notification = esignature_notifications.find_by(:envelope_id => docusign_envelope_id)
      mapped_status == 'signed' ? notification.signed! : notification.declined!
    end
  end

  def send!(signer, is_docusign, sending_entity_user, options={})
    esignature_notifications_url          = options.fetch(:esignature_notifications_url, nil)
    new_signature_packet_review_documents = options.fetch(:new_signature_packet_review_documents, [])
    multiple_send                         = options.fetch(:multiple_send, false)
    deal_signer_signing_capacities = signer.signing_capacities.select { |signing_capacity| signing_capacity.get_signature_group.deal_id == deal.id }
    signature_pages_to_send = deal_signer_signing_capacities.map(&:ready_signature_pages).flatten.select{ |page| page.is_docusign? == is_docusign }
    # only continue if there are actually pages
    return false if signature_pages_to_send.empty?
    # add signature_page_collections to the packet
    signature_page_collections_to_send = signature_pages_to_send.map(&:signature_page_collection).uniq
    signature_page_collections_to_send.map { |signature_page_collection| signature_page_collection.signature_packet = self }

    # ensure ordering to make sure that can bring back from docusign correctly.
    signature_page_collections_to_send.sort_by!{|signature_page_collection| signature_page_collection.id }

    self.bypass_approval_validation = true
    save
    created_signature_packet_review_documents = []
    if !multiple_send
      # create signature_packet_review_documents when sending for one user at a time.
      closing_ids = deal.closing_category.descendants.pluck(:id)
      new_signature_packet_review_documents.each do |new_signature_packet_review_document|
        if new_signature_packet_review_document['tree_element_id']
          # ensure the tree_element_id sent in by the frontend is in the closing_category
          next if !closing_ids.include?(new_signature_packet_review_document['tree_element_id'].to_i)
          # create the signature_packet_review_documents and save the ones that correspond to tree_elements in the case you have to delete later.
          created_signature_packet_review_documents << signature_packet_review_documents.create(tree_element_id: new_signature_packet_review_document['tree_element_id'].to_i)
        else
          temp_upload = sending_entity_user.user.temp_uploads.find_by(id: new_signature_packet_review_document['temp_upload_id'].to_i)
          signature_packet_review_document = signature_packet_review_documents.create(file_name: temp_upload.file_name) if temp_upload
          created_signature_packet_review_documents << signature_packet_review_document if signature_packet_review_document
          file = File.open(temp_upload.original_path)
          signature_packet_review_document.upload!(file) if signature_packet_review_document.persisted?
        end
      end
    else
      # create signature_packet_review_documents when sending for multiple users at once
      created_signature_packet_review_documents = signature_pages_to_send.map{ |signature_page| signature_packet_review_documents.create(tree_element_id: signature_page.tree_element_signature_group.tree_element_id) }
    end

    # update signature page statuses
    signature_pages_to_send.each do |page|
      page.sending!
    end

    # filter out signature_packet_review_documents that didn't save
    created_signature_packet_review_documents = created_signature_packet_review_documents.select{ |signature_packet_review_document| signature_packet_review_document.persisted? }

    SendSignaturePacketsJob.perform_later(self, signature_page_collections_to_send, sending_entity_user, { notifications_url: esignature_notifications_url, docusign: is_docusign, created_signature_packet_review_documents: created_signature_packet_review_documents })
  end

  def get_packet_type_awaiting_signature_status
    SignaturePage::PACKET_TYPE_READY_SIGNATURE_STATUS_MAPPING[self.packet_type.to_sym]
  end

  private

  def cleanup_packet_email_options
    return if packet_type == "email"
    # if this is link or download, we don't need to save the copy_to or message attributes
    copy_to = nil
    message = ""
  end
end
