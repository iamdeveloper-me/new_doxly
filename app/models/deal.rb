class Deal < ActiveRecord::Base

  # Magic constants
  STATUSES                = ["open", "closed", "archived"]
  OPEN_STATUSES           = ["open"]
  ACTIVE_STATUSES         = ["open", "closed"]
  ARCHIVED_STATUSES       = ["archived"]
  CLOSED_STATUSES         = ["closed"]
  TRANSACTION_TYPES       = ["M&A", "Venture Capital", "Commercial Lending", "Other"]
  FONT_TYPES              = ["Arial", "Courier", "Times New Roman", "Verdana", "Calibri"]
  FONT_SIZES              = ["11", "12", "14", "15", "16"]
  # A deal is considered nearing completion if it's projected
  # close date is within this many days
  NEARING_COMPLETION_DAYS = 30
  SEARCH_FIELDS           = [:title]
  DILIGENCE_FILTER_FIELDS = [
    "No Filter",
    "All Documents",
    "I Assigned",
    "Assigned to Me",
    "To Review",
    "Has Notes"
  ]
  CLOSING_FILTER_FIELDS = {
    :owning_counsel => [
      "No Filter",
      "All Documents",
      "I Assigned",
      "Assigned to Me",
      "To Complete",
      "Has Notes",
      "Needs Signature"
    ],
    :opposing_counsel => [
      "No Filter",
      "All Documents",
      "Assigned to Me",
      "Has Notes",
      "Needs Signature"
    ],
    :party => [
      "No Filter",
      "All Documents",
      "Assigned to Me",
      "Has Notes",
      "Needs Signature",
      "Needs My Signature"
    ]
  }

  attr_accessor :bypass_create_categories

  has_many   :starred_deals,            :dependent => :destroy
  has_many   :deal_entity_users,        :through => :deal_entities, :autosave => true
  has_many   :entity_users,             :through => :deal_entity_users
  has_many   :categories,               -> { where(type: ['DiligenceCategory', 'ClosingCategory']) }, class_name: 'TreeElement', as: :owner
  has_one    :diligence_category,       :as => :owner, :dependent => :destroy
  has_one    :closing_category,         :as => :owner, :dependent => :destroy
  has_many   :entities,                 :through => :deal_entities
  has_many   :deal_entities,            :dependent => :destroy
  has_many   :starred_by,               :through => :starred_deals, :source => :entity_user
  has_many   :closing_books
  has_many   :notes,                    :as => :ownable
  has_many   :events,                   :as => :eventable, :dependent => :destroy
  has_many   :sub_events,               :as => :associatable, :class_name => 'Event'
  belongs_to :deal_type
  has_many   :question_responses,       :inverse_of => :deal, :autosave => true
  # for uplaced_attachments and versions
  has_many   :unplaced_attachments,     class_name: 'Attachment', as: :attachable, dependent: :destroy
  has_many   :unplaced_versions,        through: :unplaced_attachments, source: :versions
  # don't use this association except on the working group list
  has_many   :roles,                    as: :roleable
  # these are used in the "active_roles" method below
  has_many   :active_roles_on_deal_entity,        through: :deal_entities, source: :roles
  has_many   :active_roles_on_deal_entity_users,  through: :deal_entity_users, source: :roles
  has_many   :signature_packets,                  dependent: :destroy
  has_many   :signature_pages,                    through: :signature_packets
  has_many   :signature_groups,                   dependent: :destroy
  has_many   :block_collections,                  through: :signature_groups
  has_many   :blocks,                             through: :block_collections
  has_many   :critical_errors,                    :as => :critical_errorable, :autosave => true, :inverse_of => :critical_errorable
  has_many   :login_tokens,                       :dependent => :destroy
  has_many   :manual_signature_errors,            -> { where(:error_type => 'manual_signatures_error') }, :as => :critical_errorable, :inverse_of => :critical_errorable, class_name: 'CriticalError'
  has_many   :send_packets_errors,                -> { where(:error_type => 'send_packets_error') }, :as => :critical_errorable, :inverse_of => :critical_errorable, class_name: 'CriticalError'
  has_many   :voting_interest_groups,             dependent: :destroy

  has_one    :dms_deal_storage_details,           dependent: :destroy
  has_many   :unmatched_signature_uploads,        :dependent => :destroy

  accepts_nested_attributes_for :question_responses

  validates :title,                             :presence => true, :length => {maximum: 250}
  validates :deal_size,                         :presence => true, :numericality => { :message => "must be a valid number (10000 not $10000 or $10,000)" }
  validates :status,                            :presence => true, :inclusion => { :in => STATUSES }
  validates :projected_close_date,              :presence => { :message => "must be a valid date MM/DD/YYYY" }
  validates_presence_of :is_active
  validates_uniqueness_of :deal_email,          :case_sensitive => false, allow_blank: true
  validates :deal_email,                        :format => { :with => /\A[A-Za-z0-9]+\z/, :message => "can only include letters and numbers"}, length: {maximum: 15}, allow_nil: true
  validates_inclusion_of :font_size,            in: FONT_SIZES
  validates_inclusion_of :font_type,            in: FONT_TYPES
  validates_inclusion_of :has_voting_threshold, in: [ true, false ]
  validate :cannot_disable_voting_threshold, on: :update

  scope :behind_schedule,     -> { where('projected_close_date < ?', Date.today).uniq.order('projected_close_date ASC') }
  scope :nearing_completion,  -> { where('projected_close_date >= ? AND projected_close_date < ?', Date.today, Date.today + NEARING_COMPLETION_DAYS.days).uniq.order('projected_close_date ASC') }
  scope :open,                -> { where(status: OPEN_STATUSES).uniq }
  scope :closed,              -> { where(status: CLOSED_STATUSES).uniq }
  scope :active,              -> { where(status: ACTIVE_STATUSES).uniq }
  scope :complete,            -> { where(status: ARCHIVED_STATUSES).uniq }

  before_validation :set_default_status
  before_validation :set_deal_email_to_nil
  after_create      :create_categories, :unless => :bypass_create_categories?

  def bypass_create_categories?
    bypass_create_categories
  end

  def get_descendants_with_attachments
    diligence_category.descendants.with_attachment + closing_category.descendants.with_attachment
  end

  def participatable_by?(entity_user)
    self.deal_entity_users.map(&:entity_user_id).include?(entity_user.id)
  end

  def is_owning_entity?(entity)
    self.owner_entity == entity
  end

  def owner_deal_entity
    self.deal_entities.find_by(is_owner: true)
  end

  def owner_entity
    owner_deal_entity&.entity
  end

  def counsel_entities
    self.deal_entity_users.includes(:entity_user => [:entity]).map{ |dc| dc.entity_user.entity if dc.entity_user.entity.is_counsel? }.compact.uniq
  end

  def counsel_entities_count
    counsel_entities.size
  end

  def deal_entity_user_for(entity_user_id)
    self.deal_entity_users.find_by(:entity_user_id => entity_user_id)
  end

  def set_default_status
    self.status = "open" unless status
  end

  def set_deal_email_to_nil
    self.deal_email = nil if self.deal_email == ""
  end

  def add_entity_user(entity_user_id, deal_entity, is_owner=false, save_record=true)
    new_deal_entity_user                         = deal_entity.deal_entity_users.find_or_initialize_by(:entity_user_id => entity_user_id)
    new_deal_entity_user.is_owner                = is_owner
    new_deal_entity_user.role                    = deal_entity_user_role_for(new_deal_entity_user, deal_entity.is_owner == true)
    new_deal_entity_user.save if save_record
    new_deal_entity_user
  end

  # Will return date like so: December 2015
  def friendly_date
    projected_close_date.strftime("%B %Y")
  end

  def starred_by? user
    return StarredDeal.where(entity_user_id: user.entity_users.pluck(:id), deal_id: self.id).present?
  end

  def close!
    self.status = "closed"
    self.save
  end

  def reopen!
    self.status = "open"
    self.save
  end

  def archive!
    self.status = "archived"
    self.save
  end

  def unarchive!
    self.status = "closed"
    self.save
  end

  def open?
    OPEN_STATUSES.include? self.status
  end

  def active?
    ACTIVE_STATUSES.include? self.status
  end

  def complete?
    ARCHIVED_STATUSES.include? self.status
  end

  def closed?
    CLOSED_STATUSES.include? self.status
  end

  def archived?
    ARCHIVED_STATUSES.include? self.status
  end

  def entity_user_ids
    self.entity_users.map &:id
  end

  def recent_events(entity_id)
    events         = (self.events.includes(:eventable) + self.sub_events.includes(:eventable)).sort_by(&:created_at).uniq.reverse.reject{ |e| e.action == 'NOTE_ADDED' && !e.eventable.is_public && e.eventable.entity_user.entity_id != entity_id }.first(15)
    group_events_by_type(events)
  end

  def events_between(start_time, end_time)
    (self.events.allowed_digest_events.includes(:eventable).where(created_at: start_time..end_time) + self.sub_events.allowed_digest_events.includes(:eventable).where(created_at: start_time..end_time)).uniq.sort_by(&:eventable_id)
  end

  def group_events_by_type(events)
    events.group_by{|event| event[:action]}
  end

  def group_events_by_eventable(events)
    events.each_with_object({}) do |event, hash|
      eventable = event.eventable.try(:noteable) || event.eventable.try(:documentable) || event.eventable
      if hash.key?(eventable)
        hash[eventable] << event
      else
        hash[eventable] = [event]
      end
    end
  end

  def full_deal_email
    Doxly.config.deal_email_beginning + self.deal_email + Doxly.config.deal_email_ending
  end

  def category_descendants
    sql = TreeElement.connection.unprepared_statement { "((#{diligence_category.descendants.to_sql}) UNION (#{closing_category.descendants.to_sql})) AS tree_elements"}
    TreeElement.from(sql)
  end

  # use to get roles whenever not on the working group list.
  def active_roles
    active_roles_on_deal_ | active_roles_on_deal__users
  end

  def all_signing_capacities
    signature_groups.map(&:all_signing_capacities).flatten
  end

  def user_signing_capacities(user_id)
    all_signing_capacities.select{ |deal_signing_capacity| deal_signing_capacity.user_id == user_id }
  end

  def signature_packets_ordered_by_reminder_timestamp(user)
    self.signature_packets.where(user_id: user.id).order(:reminder_email_timestamp)
  end

  def parameterized_font_type
    self.font_type.parameterize("-")
  end

  def executed_signatures?
    self.closing_category.descendants.signature_required.any?(&:is_executed?)
  end

  def create_critical_error(error_type, options={})
    self.critical_errors.new.save_new!(error_type, options)
  end

  def signers
    signature_groups.map(&:all_signing_capacities).flatten.uniq.map(&:user).flatten.uniq
  end

  def owner_entity_users
    owner_deal_entity.deal_entity_users.map(&:user)
  end

  def create_or_update_dms_deal_storage_detailable(dms_deal_storage_detailable_attributes)
    # just in case, return false if the entity isn't set up with dms
    return false unless dms_deal_storage_detailable_class
    if dms_deal_storage_detailable
      dms_deal_storage_detailable.create_or_update!(dms_deal_storage_detailable_attributes)
    else
      # get the right class name from the dms_entity_storage (ie. if the dms_entity_storage is iManage, it will return an iManageDealStorageClass)
      new_dms_deal_storage_detailable = dms_deal_storage_detailable_class.new.create_or_update!(dms_deal_storage_detailable_attributes)
      new_dms_deal_storage = build_dms_deal_storage_details
      new_dms_deal_storage.dms_deal_storage_detailable = new_dms_deal_storage_detailable
      new_dms_deal_storage.save
    end
  end

  def dms_deal_storage_detailable_class
    owner_entity.dms_entity_storage&.dms_entity_storageable&.dms_deal_detailable_class
  end

  def dms_deal_storage_detailable
    dms_deal_storage_details&.dms_deal_storage_detailable
  end

  # action is regex
  # examples:
  #   /C/ (has create permission)
  #   /C|R/ (has create permission or read permission)
  #   /C+R+/ (has create permission and read permission)
  def can?(action, feature)
    owner_entity.can?(action, feature)
  end

  def create_deal_team(current_entity, current_entity_user)
    # create the owner deal entity
    owning_deal_entity = deal_entities.create(entity_id: current_entity.id, is_owner: true)
    # create all the deal entity users
    current_entity_user_id = current_entity_user.id
    owning_deal_entity.deal_entity_users.create(entity_user_id: current_entity_user_id, is_owner: true, role: 'owning_counsel')
    current_entity.entity_users.where.not(id: current_entity_user_id).can_see_all_deals.each do |entity_user|
      owning_deal_entity.deal_entity_users.create(entity_user_id: entity_user.id, is_owner: false, role: 'owning_counsel')
    end
    owning_deal_entity
  end

  def set_number_of_placeholder_signers!(count)
    # can't let the count decrease
    return if self.number_of_placeholder_signers >= count
    self.number_of_placeholder_signers = count
    self.save
  end

  def can_toggle_voting_threshold?
    !has_voting_threshold? || closing_category.descendants.voting_threshold_required.empty?
  end

  def cannot_disable_voting_threshold
    # cannot disable VT if there are documents requiring VT
    # i wanted to use the can_toggle_voting_threshold method, but I need to look at what the value was not the current value
    if has_voting_threshold_changed? && has_voting_threshold_was && closing_category.descendants.voting_threshold_required.any?
      self.errors.add("has_voting_threshold", "cannot be changed if documents require voting threshold. Please change the signature type on any documents that require voting threshold first.")
    end
  end

  private

  def create_categories
    diligence_template = DiligenceCategory.new.all_templates(self.owner_entity, self.deal_type_id).first
    self.diligence_category = diligence_template ? diligence_template.category.dup_tree() : DiligenceCategory.new

    closing_template = ClosingCategory.new.all_templates(self.owner_entity, self.deal_type_id).first
    self.closing_category = closing_template ? closing_template.category.dup_tree() : ClosingCategory.new
  end

  def deal_entity_user_role_for(deal_entity_user, is_owner= false)
    entity_user_entity = deal_entity_user.deal_entity.entity
    if !entity_user_entity.is_counsel?
      'client'
    elsif is_owner == true || entity_user_entity == self.owner_entity
      'owning_counsel'
    else
      'opposing_counsel'
    end
  end

end
