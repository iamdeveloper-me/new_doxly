class TreeElement < ActiveRecord::Base
  has_ancestry # implements several methods, such as ancestors, children, and descendants: https://github.com/stefankroes/ancestry

  MAX_SIGNATURE_PAGE_COPIES    = 10

  attr_accessor :permitted
  enum signature_type: {
    no_signature: 0,
    signature_required: 1,
    voting_threshold_required: 2
  }

  # *** IMPORTANT ***
  # Because dependent: :destroy is also called as a before_destroy callback,
  # it's safest to use prepend: :true AND to put in the code before the relevant associations
  # to make sure it's called BEFORE its children are destroyed.
  before_destroy :check_no_signatures_sent, prepend: true

  acts_as_list scope: [:ancestry]

  belongs_to :parent, polymorphic: true
  belongs_to :owner, polymorphic: true
  has_many   :signature_page_collections, through: :tree_element_signature_groups
  has_many   :signature_pages, through: :signature_page_collections
  has_many   :signature_packets, through: :signature_page_collections
  has_many   :signature_groups, through: :tree_element_signature_groups
  has_many   :signing_capacities, through: :signature_groups
  has_many   :notes, -> { order(created_at: :asc) }, :as => :noteable, :dependent => :destroy
  has_one    :attachment, dependent: :destroy, as: :attachable
  has_many   :events, :as => :eventable, :dependent => :destroy
  has_many   :tree_element_signature_groups, -> { order(:created_at) }, :dependent => :destroy
  has_many   :signature_packet_review_documents, dependent: :destroy
  has_many   :completion_statuses
  has_many   :responsible_parties, dependent: :destroy
  has_many   :to_dos, dependent: :destroy
  has_many   :tree_element_restrictions, dependent: :destroy

  scope :with_attachment, -> { joins(:attachment) }
  scope :include_associations, -> { includes(:owner => :deal_entitites).includes(:attachment => :versions).includes(:notes).includes(:notes => :entity_user) }
  scope :as_tree, -> { arrange(:order => :position) }
  scope :signature_required, -> { where.not(signature_type: TreeElement.signature_types[:no_signature]) }
  scope :voting_threshold_required, -> { where(signature_type: TreeElement.signature_types[:voting_threshold_required])}
  default_scope { order(:position) }

  validates :name, presence: true, unless: "type == 'ClosingCategory' || type == 'DiligenceCategory'"
  validate :cannot_change_when_signatures_sent, :on => :update
  validate :cannot_change_type_if_requires_signature, :on => :update
  validates :number_of_signature_page_copies, numericality: { less_than_or_equal_to: MAX_SIGNATURE_PAGE_COPIES }

  after_create  :create_tree_element_restriction
  before_save   :ensure_signature_default
  before_save   :ensure_signature_page_document_name_nil
  before_save   :cleanup_completion_statuses, on: :update
  after_save    :cleanup_tree_element_signature_groups
  after_save    :generate_thumbnails, on: :update
  after_save    :clean_childrens_positions

  def cannot_change_when_signatures_sent
    if has_signature_packets?
      self.errors.add("name", "cannot be changed once document has been sent for signature. Please void any signature packets that have been sent for this document first.") if self.name_changed?
      self.errors.add("signature required", "cannot be changed once document has been sent for signature. Please void any signature packets that have been sent for this document first.") if self.signature_type_changed?
      self.errors.add("signature page document name", "cannot be changed once document has been sent for signature. Please void any signature packets that have been sent for this document first.") if self.signature_page_document_name_changed?
    end
  end

  def cannot_change_type_if_requires_signature
    if signature_required? && type != type_was
      self.errors.add(:type, :type_cannot_be_changed_if_signature_required)
    end
  end

  def deal
    deal = root.owner
    deal.is_a?(Deal) ? deal : nil
  end

  def template
    template = root.owner
    template.is_a?(Template) ? template : nil
  end

  def dup_tree(tree = self.subtree.as_tree.first, ancestry = nil)
    transaction do
      # duplicate this tree_element
      tree_element = tree.first
      new_tree_element = tree_element.dup
      new_tree_element.owner_id = nil
      new_tree_element.owner_type = nil
      new_tree_element.ancestry = ancestry
      new_tree_element.save

      # duplicate each child with the correct ancestry
      ancestry = ancestry ? "#{ancestry}/#{new_tree_element.id}" : "#{new_tree_element.id}"
      children = tree.last
      children.each do |tree|
        self.dup_tree(tree, ancestry)
      end
      new_tree_element
    end
  rescue StandardError => e
    Rails.logger.error("Unable to save template: {e}")
  end

  def deal
    deal = root.owner
    deal.is_a?(Deal) ? deal : nil
  end

  def template
    template = root.owner
    template.is_a?(Template) ? template : nil
  end

  def get_category
    # will return self for orphan documents
    self.root
  end

  def has_post_closing_parent
    is_post_closing || self.ancestors.where("is_post_closing = ?", true).count > 0
  end

  def latest_version
    attachment&.versions&.reload&.last
  end

  def executable_version
    return nil if !attachment
    attachment&.versions.where.not(status: 'executed')&.reload.last
  end

  def sanitized_name
    name.gsub(/[^0-9A-Za-z]/, '')
  end

  def is_orphan?
    owner.is_a?(Deal) && self.is_a?(Document)
  end

  def attachment_allowed?
    allowed_checklist_items = self.get_category.type === 'DiligenceCategory' ? ['Document'] : ['Task', 'Document']
    allowed_checklist_items.include?(type)
  end

  def mark_as_complete_allowed?
    ['Task'].include?(type)
  end

  def document_name
    self.signature_page_document_name || self.name
  end

  def descendant_documents
    descendants.where(type: "Document")
  end

  #
  # TODO: These document specific methods need to be moved to the Document model
  #
  def is_final?
    attachment&.is_final?
  end

  def is_executed?
    attachment&.is_executed?
  end

  def currently_executed_version
    attachment.versions.where(status: 'executed').order(:id).last
  end

  # conditions for a document to be execute are: signed or executed signature pages, has a document with thumbnails, and is not currently executing
  def ready_for_execution?
    any_signature_pages_signed? && executable_version&.page_count && !any_signature_pages_executing?
  end

  def executed_or_executing?
    is_executed? || any_signature_pages_executing?
  end

  def descendant_has_signature_packets?
    self.descendants.map(&:has_signature_packets?).any?
  end

  def has_signature_packets?
    self.signature_packets.any?
  end

  def signature_pages_executing?
    (signature_pages.any? && signature_pages.all?{ |sp| sp.is_executing? })
  end

  def any_signature_pages_executing?
    signature_pages.any?{|sp| sp.is_executing?}
  end

  def any_signature_pages_signed?
    signature_pages.any?{|sp| sp.signature_status == 'signed'}
  end

  def propagate_restrictions_to_descendants
    descendants.each do |descendant|
      restrictions_to_keep = []
      tree_element_restrictions.each do |restriction|
        existing_restriction = descendant.tree_element_restrictions.find_by(restrictable: restriction.restrictable)
        if existing_restriction == nil
          new_restriction = descendant.tree_element_restrictions.new
          new_restriction.restrictable = restriction.restrictable
          new_restriction.inherit = restriction.inherit
          new_restriction.save
          restrictions_to_keep << new_restriction
        else
          restrictions_to_keep << existing_restriction
        end
      end
      restrictions_to_destroy = descendant.tree_element_restrictions - restrictions_to_keep
      restrictions_to_destroy.map(&:destroy)
    end
  end

  def create_tree_element_restriction
    return unless parent.present?
    parent.tree_element_restrictions.each do |restriction|
      existing_restriction = tree_element_restrictions.find_by(restrictable_id: restriction.restrictable_id, restrictable_type: restriction.restrictable_type)
      if existing_restriction == nil
        new_restriction = tree_element_restrictions.new
        new_restriction.restrictable = restriction.restrictable
        new_restriction.inherit = restriction.inherit
        new_restriction.save
      end
    end
  end

  def generate_thumbnails
    if signature_type_changed? && signature_type_was == :no_signature && attachment.present?
      CreateThumbnailsJob.perform_later(latest_version)
    end
  end

  def all_tree_element_restrictions
    descendants.includes(:tree_element_restrictions).map(&:tree_element_restrictions).flatten
  end

  # to make the uploaded
  def sanitize_file_name_as_name
    sanitized_name_array = name.split('.')
    sanitized_name_array.pop if sanitized_name_array.length > 1
    self.name = sanitized_name_array.join('.').tr('-_', ' ').split.map(&:capitalize)*' '
  end

  # returns the documents requiring signature keeping the order of the checklist
  def documents_requiring_signature_with_position
    flat_descendants = Hash.deep_flatten_keys(tree: descendants.as_tree)
    flat_descendants.select(&:signature_required?)
  end

  def get_checklist_number
    ancestry_length = ancestry&.split('/')&.length
    case ancestry_length
    when 2
      position.to_s26.downcase
    when 3
      position.to_roman.downcase
    when 4
      position.to_s26
    when 5
      position.to_roman
    else
      position
    end
  end

  def is_restricted_from_this_entity_user?(entity_user)
    all_tree_element_restrictions = tree_element_restrictions
    all_tree_element_restrictions.select{ |tree_element_restriction| entity_user.deal_entity_users.include?(tree_element_restriction.restrictable) }.any?
  end

  def signature_required?
    TreeElement.signature_types[signature_type] != TreeElement.signature_types[:no_signature]
  end

  private

  def check_no_signatures_sent
    # signature_packets only exist after signature_pages have been sent.
    if has_signature_packets? || descendant_has_signature_packets?
      errors.add(:base, :cannot_delete_if_sent_for_signature)
      return false
    end
    return true
  end

  def ensure_signature_default
    if self.signature_type_was == :no_signature && deal&.sign_manually_by_default?
      self.sign_manually = true
    end
  end

  def ensure_signature_page_document_name_nil
    self.signature_page_document_name = nil if !self.signature_page_document_name.nil? && self.signature_page_document_name.blank?
  end

  def cleanup_tree_element_signature_groups
    return unless signature_type_changed?
    if !signature_required? && self.tree_element_signature_groups.any?
      # this document does not need signatures anymore. So, need to delete the tree element groups
      self.tree_element_signature_groups.destroy_all
    end
  end

  def cleanup_completion_statuses
    if get_category.is_a?(ClosingCategory) && type_changed?
      completion_statuses.destroy_all
      if is_final?
        version = latest_version
        version.status = 'draft'
        version.save
      end
    end
  end

  def clean_childrens_positions
    # (if parent changed) and children positions are messed up
    # ALSO WARNING: Running the below check code can change it's output. So can't run twice in a row.
    if ancestry && ancestry_was && (ancestry.split('/').last != ancestry_was.split('/').last) && (self.reload.children.pluck(:position).uniq.length !=  children.length)
      TreeElement.acts_as_list_no_update do
        children.order(:position).each_with_index do |child, i|
          child.update_columns position: i + 1
        end
      end
    end
  end
end
