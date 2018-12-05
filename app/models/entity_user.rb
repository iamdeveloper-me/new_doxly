class EntityUser < ActiveRecord::Base
  include Models::DealOwner
  include Models::ScheduledJobs

  attr_accessor :bypass_title_validation

  before_create :set_admin

  belongs_to  :user
  belongs_to  :entity
  has_many    :entity_connections,         :through => :entity
  has_many    :notes
  has_many    :starred_deals
  has_many    :deal_entity_users, :dependent => :destroy
  has_many    :deal_entities,    :through => :deal_entity_users
  has_many    :all_deals,             :through => :deal_entities, :source => :deal
  has_many    :reminders, dependent: :destroy
  has_many    :to_dos, through: :deal_entity_users
  has_many    :created_to_dos, through: :deal_entity_users
  has_many    :uploads, class_name: "Version", foreign_key: "uploader_id"
  has_one     :dms_user_credential, dependent: :destroy

  # validates_presence_of :title, unless: :bypass_title_validation?
  # validates_presence_of :role, :email_digest_preference
  # validates_uniqueness_of :user_id, { scope: :entity_id, message: :uniqueness_by_user}
  # validate :can_see_all_deals_for_firms

  scope :can_see_all_deals, -> { where(can_see_all_deals: true) }

  before_create :set_is_default

  EMAIL_DIGEST_PREFERENCES = {
    :daily_digest => 'Daily Digest',
    :none => 'No Notifications'
  }

  ROLES = {
    'read_only' => {
      entity: 'R',
      account_settings: 'RU',
      entity_user: 'R',
      entity_connection: 'R',
      reports: 'R',
      esignature: '',
      sso: '',
      licenses: '',
      deals: 'R',
      entity_level_dms_integration: ''
    },
    'standard_user' => {
      entity: 'R',
      account_settings: 'RU',
      entity_user: 'CRU',
      entity_connection: 'CRUD',
      reports: 'R',
      esignature: '',
      sso: '',
      licenses: '',
      deals: 'CR',
      entity_level_dms_integration: 'CRUD'
    },
    'entity_admin' => {
      entity: 'RU',
      account_settings: 'RU',
      entity_user: 'CRUD',
      entity_connection: 'CRUD',
      reports: 'R',
      esignature: 'RU',
      sso: 'RUD',
      licenses: 'RU',
      deals: 'CR',
      entity_level_dms_integration: 'CRUD'
    }
  }

  validates_inclusion_of :role, in: ROLES.keys
  validates_inclusion_of :email_digest_preference, in: EMAIL_DIGEST_PREFERENCES.keys.map(&:to_s)

  # Set this to be true if you want to update entity user object without setting a title
  def bypass_title_validation?
    bypass_title_validation
  end

  def my_deals
    all_deals.joins(:deal_entities).where("deal_entities.entity_id = ? and deal_entities.is_owner = true", entity.id).distinct
  end

  def collaborating_deals
    all_deals.joins(:deal_entities).where("deal_entities.entity_id = ? and deal_entities.is_owner = false", entity.id, entity.type).distinct
  end

  def name
    self.user.name
  end

  # We implement this because it's required by DealOwner
  def email_domain
    user.email_domain
  end

  def has_starred_deal? deal
    self.starred_deals.pluck(:deal_id).include? deal.id
  end

  def set_email_preference!(email_preference)
    return if email_preference.blank?
    self.email_digest_preference = email_preference
    self.save
  end

  def set_role!(role, current_entity_user)
    return if role.blank? || current_entity_user.is_disabled?(role)
    self.role = role
    self.save
  end

  def set_title!(title)
    return if title.blank?
    self.title = title
    self.save
  end

  def is_disabled?(editable_role)
    if self.role == 'standard_user' && editable_role == 'entity_admin'
      true
    elsif self.role == 'read_only' && editable_role != 'read_only'
      true
    else
      false
    end
  end

  def is_entity_admin?
    self.role == 'entity_admin'
  end

  def get_tree_elements_with_attachments
    results = []
    all_deals.each do |deal|
      results.push(*deal.get_descendants_with_attachments)
    end
    results
  end

  def set_admin
    if self.entity.entity_users.size == 1
      self.role = 'entity_admin'
    end
  end

  def set_is_default
    if self&.user.entity_users.size <= 1
      self.is_default = true
    end
  end

  def make_default!
    return unless self.user.entity_users.count > 1
    self.user.entity_users.where(:is_default => true).update_all :is_default => false
    self.is_default = true
    self.bypass_title_validation = true
    self.save
  end

  def belongs_to_law_firm?
    entity.is_counsel?
  end

  def dms_user_credentialable
    dms_user_credential&.dms_user_credentialable
  end

  private

  def can_see_all_deals_for_firms
    if can_see_all_deals && !entity.is_counsel?
      errors.add(:base, "Only law firm users can have the 'Can see all deals' setting enabled")
    end
  end

end
