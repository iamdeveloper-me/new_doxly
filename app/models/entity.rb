class Entity < ActiveRecord::Base
  attr_accessor :email_domain

  DEFAULT_ENTITY_STORAGE_TYPES = %w(aws)
  PRODUCTS = %w(closing collaboration)
  FEATURES = {
    closing: {
      data_room: '',
      roles: 'RU',
      entities: '',
      collaborators: '',
      notes: '',
      team_members: 'CRUD',
      sidebar: '',
      responsible_parties: ''
    },
    collaboration: {
      data_room: 'CRUD',
      roles: 'CRUD',
      entities: 'CRUD',
      collaborators: 'CRUD',
      notes: 'CR',
      team_members: 'CRUD',
      sidebar: 'R',
      responsible_parties: 'CRUD'
    }
  }

  validates_inclusion_of :is_counsel, :in => [true, false]
  validates_presence_of :name, :type
  validates :default_entity_storage_type, inclusion: { in: DEFAULT_ENTITY_STORAGE_TYPES }
  validates :product, inclusion: { in: PRODUCTS }
  validates :hdd_entity_storage, presence: true
  validates :aws_entity_storage, presence: true

  has_many :entity_users
  has_many :users,                        :through => :entity_users

  has_many :events
  has_many :entity_connections,           :foreign_key => :my_entity_id
  has_many :connected_entities,           :through => :entity_connections
  has_many :connected_entity_users,       :through => :connected_entities, :source => :entity_users
  has_one  :esignature_provider,          :dependent => :destroy
  has_many :sso_provider_configurations,  :dependent => :destroy
  has_many :deal_types,                   :dependent => :destroy
  has_many :templates,                    :dependent => :destroy
  has_many :due_dates,                    :dependent => :destroy
  has_many :completion_statuses
  has_many :deal_entities
  has_many :deals,                        through: :deal_entities
  has_many :owner_deal_entities,          -> { owner }, :class_name => 'DealEntity'
  has_many :owned_deals,                  :through => :owner_deal_entities, :source => :deal
  has_many :categories,                   :through => :deals
  has_many :collaborator_deal_entities,    -> {collaborator}, :class_name => 'DealEntity'
  has_many :collaborating_deals,          :through => :collaborator_deal_entities, :source => :deal
  has_one  :hdd_entity_storage,           dependent: :destroy, autosave: true
  has_one  :aws_entity_storage,           dependent: :destroy, autosave: true
  has_one  :dms_entity_storage,           dependent: :destroy, autosave: true

  mount_uploader :logo, EntityLogoUploader

  has_many :licenses,                     :dependent => :destroy
  has_one  :primary_address,              :as => :addressable, :dependent => :destroy, autosave: true
  validate :name_must_be_unique_if_organization, on: :create

  before_validation :create_entity_storages, on: :create

  # TODO: This should be handled in the Organization model validations but entity connections concern is saving as entity
  def name_must_be_unique_if_organization
    unless type == "Individual"
      self.errors.add(:name, :is_already_taken) if Entity.where('lower(name) = ?', name.downcase).any?
    end
  end

  def all_entity_users
    self.entity_users + self.connected_entities.includes(:entity_users).map { |o| o.entity_users }.flatten
  end

  def all_entity_user_ids
    all_entity_users.map(&:id)
  end

  def email_domain
    entity_users.first.try(:email_domain)
  end

  def connected_entity_users_for_deal(deal)
    users = []
    self.connected_entities.each do |entity|
      entity.users.each { |u| users << ["#{entity.name} - #{u.email}", u.entity_user.id] unless deal.entity_user_ids.include?(u.entity_user.id) }
    end
    users
  end

  def entity_connection_by_entity(entity_id)
    entity_connections.find_by(:connected_entity_id => entity_id)
  end

  def is_active?
    return false if self.entity_users.empty?
    self.entity_users.map{ |o| o.user.is_active }.include? true
  end

  def all_templates
    Template.where("entity_id = ? OR entity_id IS ?", self.id, nil)
  end

  def has_category_access?(category)
    category.is_diligence? || (category.is_closing? && self.is_counsel?)
  end

  def connected_clients
    connected_entities.where(is_counsel: false).order(:name)
  end

  def connected_firms
    connected_entities.where(is_counsel: true).order(:name)
  end

  def initials
    result = name.split.map(&:first).first(2).join
    result = 'X' if result.blank?
    result
  end

  def avatar_color
    colors = ["orange", "blue", "grey"]
    colors[self.id % 3]
  end

  def entity_type
    self.is_counsel? ? :law_firm : :party
  end

  def display_name
    self.name
  end

  def default_entity_storage
    send("#{default_entity_storage_type}_entity_storage")
  end

  def dms_entity_storageable
    dms_entity_storage&.dms_entity_storageable
  end

  def sso_available?
    sso_provider_configurations.active.any?
  end

  # action is regex
  # examples:
  #   /C/ (has create permission)
  #   /C|R/ (has create permission or read permission)
  #   /C+R+/ (has create permission and read permission)
  def can?(action, feature)
    !!(get_feature(feature) =~ /#{action.to_s}/)
  end

  private

  def get_feature(feature)
    FEATURES[product.to_sym][feature.to_sym]
  end

  def create_entity_storages
    build_hdd_entity_storage unless hdd_entity_storage
    build_aws_entity_storage unless aws_entity_storage
  end
end
