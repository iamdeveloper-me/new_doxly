class DealEntityUser < ActiveRecord::Base
  include Models::Restrictable

  belongs_to :deal_entity
  delegate   :deal,                  to: :deal_entity, :allow_nil => true
  belongs_to :entity_user,           :foreign_key => :entity_user_id
  has_one    :user,                  :through => :entity_user
  has_one    :entity,                :through => :entity_user
  has_many   :events,                :as => :eventable, :dependent => :destroy
  has_many   :closing_books,         :foreign_key => :creator_id, :dependent => :destroy
  has_many   :question_responses
  has_many   :responsible_parties
  has_many   :to_dos
  has_many   :created_to_dos, class_name: "ToDo", foreign_key: :creator_id

  after_create  :create_tree_element_restriction
  after_destroy :delete_events
  validates_presence_of :deal
  validates_presence_of :entity_user_id
  validate :deal_entity_must_match_entity

  scope :owners, -> { where(is_owner: true) }

  ROLES = {
    'client' => {
      deal: 'R',
      section: 'CRU',
      task: 'CRU',
      folder: 'CRUD',
      sign_document: 'RU',
      document: 'CRUD',
      attachment: 'CRUD',
      version: 'CRD',
      tree_element_signature: 'R',
      note: 'CRD',
      question_response: '',
      closing_book: '',
      reminder: 'CRUD',
      deal_template: '',
      deal_entity: 'R',
      completion_status: 'CRUD',
      responsible_party: 'CRU',
      to_do: 'CRUD',
      role: 'R',
      signature_management: 'R',
      tree_element_restriction: 'R',
      dms_integration: '',
      voting_threshold: 'R'
    },
    'opposing_counsel' => {
      deal: 'R',
      section: 'CRUD',
      task: 'CRUD',
      folder: 'CRUD',
      sign_document: 'RU',
      document: 'CRUD',
      attachment: 'CRUD',
      version: 'CRUD',
      tree_element_signature: 'CRUD',
      note: 'CRUD',
      question_response: 'CRUD',
      closing_book: '',
      reminder: 'CRUD',
      deal_template: '',
      deal_entity: 'CRUD',
      completion_status: 'CRUD',
      responsible_party: 'CRUD',
      to_do: 'CRUD',
      role: 'R',
      signature_management: 'R',
      tree_element_restriction: 'R',
      dms_integration: '',
      voting_threshold: 'R'
    },
    'owning_counsel' => {
      deal: 'RU',
      section: 'CRUD',
      task: 'CRUD',
      folder: 'CRUD',
      sign_document: 'RU',
      document: 'CRUD',
      attachment: 'CRUD',
      version: 'CRUD',
      tree_element_signature: 'CRUD',
      note: 'CRD',
      question_response: 'CRUD',
      closing_book: 'CRUD',
      reminder: 'CRUD',
      deal_template: 'CRUD',
      deal_entity: 'CRUD',
      completion_status: 'CRUD',
      responsible_party: 'CRUD',
      to_do: 'CRUD',
      role: 'CRUD',
      signature_management: 'CRUD',
      tree_element_restriction: 'CRUD',
      dms_integration: 'CRUD',
      voting_threshold: 'CRUD'
    }
  }

  def delete_events
    self.events.destroy_all
  end

# use when querying the roles that individuals perform
  def all_roles
    roles + deal_entity.roles
  end

  def deal_entity_must_match_entity
    self.errors.add(:entity, "doesn't match user") if self.entity_user.entity != self.deal_entity.entity
  end

  def name
    entity_user.name
  end

  def descendant_restrictions(tree_element)
    # do nothing
    []
  end

  def propagate_restriction_to_children(tree_element)
    # do nothing
  end

  def remove_restriction_from_children(tree_element)
    # do nothing
  end

  def can_see_all_deals?
    entity_user.can_see_all_deals?
  end

  def create_tree_element_restriction
    return if deal_entity.is_owner
    deal_entity.tree_element_restrictions.each do |restriction|
      new_restriction = tree_element_restrictions.new
      new_restriction.tree_element = restriction.tree_element
      new_restriction.inherit = true
      new_restriction.save
    end
  end

end
