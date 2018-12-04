class SigningCapacity < ActiveRecord::Base
  include Models::Signable
  include Models::Addressable

  TITLE_PLACEHOLDER = '[Title]'
  FIRST_NAME_PLACEHOLDER = 'Unnamed'
  LAST_NAME_PLACEHOLDER  = 'Signer'

  attr_accessor :bypass_create_pages, :use_placeholder_name

  belongs_to :user
  belongs_to :block, inverse_of: :signing_capacity
  belongs_to :signature_entity, inverse_of: :signing_capacities
  has_many   :signature_pages, dependent: :destroy
  has_many   :signature_page_collections, through: :signature_pages
  has_many   :tree_elements, through: :signature_pages
  has_one    :block_collection, through: :block
  has_one    :signature_group, through: :block_collection
  has_one    :primary_address, as: :addressable, dependent: :destroy, autosave: true, :inverse_of => :addressable
  has_one    :copy_to_address, as: :addressable, dependent: :destroy, autosave: true, :inverse_of => :addressable

  validates_presence_of :user
  validates_presence_of :first_name, unless: :use_placeholder_name
  validates_presence_of :last_name,  unless: :use_placeholder_name
  validates_length_of   :full_name,  :maximum => 98, if: -> { self.full_name_present? }
  validate :has_signature_entity_or_block
  validates :title, presence: true, :if => Proc.new { |s| s.signature_entity.present? }

  before_save         :update_placeholder_id
  before_validation   :set_user
  before_validation   :set_user_placeholder
  before_validation   :set_title
  before_validation   :set_placeholder_name
  after_create        :create_signature_pages, :unless => :bypass_create_pages?
  after_destroy       :delete_user_if_unused

  accepts_nested_attributes_for :user
  accepts_nested_attributes_for :primary_address, allow_destroy: true
  accepts_nested_attributes_for :copy_to_address, allow_destroy: true

  # allows nested attributes for user to use an existing record
  def user_attributes=(attributes)
    if attributes['id'].present?
      self.user = User.find(attributes['id'])
    end
    super
  end

  def bypass_create_pages?
    bypass_create_pages
  end

  def set_user_placeholder
    user.use_placeholder_name = self.use_placeholder_name? unless user.persisted?
    # returning false stops validation chain
    return true
  end

  def has_signature_entity_or_block
    unless signature_entity.present? ^ block.present?
      errors.add(:base, "Signing capacity must contain either signature entity or block, but not both")
    end
  end

  def set_title
    self.title = TITLE_PLACEHOLDER if title.blank?
  end

  def title_present?
    self.title != TITLE_PLACEHOLDER
  end

  def use_placeholder_name?
    use_placeholder_name
  end

  def full_name_present?
    !(self.first_name == FIRST_NAME_PLACEHOLDER && self.last_name == LAST_NAME_PLACEHOLDER || (self.first_name.blank? && self.last_name.blank?))
  end

  def name
    self.full_name_present? ? self.full_name : self.email
  end

  def full_name
    [self.first_name, self.last_name].join(' ')
  end

  def set_placeholder_name
    return true unless use_placeholder_name?
    self.first_name = FIRST_NAME_PLACEHOLDER
    self.last_name  = LAST_NAME_PLACEHOLDER
  end

  def has_placeholder_name?
    self.first_name == SigningCapacity::FIRST_NAME_PLACEHOLDER && self.last_name == SigningCapacity::LAST_NAME_PLACEHOLDER
  end

  def has_sent_packets?
    signature_page_collections.joins(:signature_packet).any?
  end

  def unscoped_tree_element_signature_pages(tree_element_id)
    signature_pages
      .unscoped
      .where(signing_capacity_id: self.id)
      .joins(:tree_element_signature_group)
      .where(tree_element_signature_groups: { tree_element_id: tree_element_id })
  end

  def included?(tree_element_id)
    signature_pages
      .joins(:tree_element_signature_group)
      .where(tree_element_signature_groups: { tree_element_id: tree_element_id })
      .any?
  end

  def get_signature_group
    if signature_entity.present?
      signature_entity.root.block.block_collection.signature_group
    else
      block.block_collection.signature_group
    end
  end

  def get_block_collection
    if signature_entity.present?
      signature_entity.root.block_collection
    else
      block_collection
    end
  end

  def get_block
    if signature_entity.present?
      signature_entity.root.block
    else
      block
    end
  end

  def signature_packet
    signature_page_collection.signature_packet
  end

  def name
    if self.has_placeholder_name?
      "[#{self.full_name} #{self.placeholder_id}]"
    else
     self.full_name
    end
  end

  def has_email?
    self.user.email.present?
  end

  def update_placeholder_id
    if self.has_placeholder_name?
      # nothing to do if there is already a placeholder id -- if there are multiple capacities with the same email, we are
      # setting them all to the same placeholder_id in the controller update
      unless self.placeholder_id.present?
        user_signing_capacity_with_placeholder = user_signing_capacity_on_deal.find{ |siging_capacity| siging_capacity.has_placeholder_name? }
        new_placeholder_id = if user_signing_capacity_with_placeholder.present?
          user_signing_capacity_with_placeholder.placeholder_id
        else
          deal.number_of_placeholder_signers + 1
        end
        self.placeholder_id = new_placeholder_id
      end
      # since we are letting the frontend dictate the placeholder_id incrementing, need to update the deal count accordingly
      deal.set_number_of_placeholder_signers!(self.placeholder_id)
    else
      self.placeholder_id = nil
    end
  end

  def user_signing_capacity_on_deal
    deal.user_signing_capacities(self.user.id)
  end

  def deal
    get_signature_group.deal
  end

  def set_user
    user.bypass_password_validation = true
    user.bypass_email_validation = true if user.email.blank?
  end

  def unscoped_signature_pages
    signature_pages.unscoped.where(signing_capacity_id: self.id)
  end

  def create_signature_pages
    prior_signing_capacity = (get_signature_group.signing_capacities - [self]).first
    disabled_tree_element_ids = []
    if prior_signing_capacity
      disabled_tree_element_ids = prior_signing_capacity.unscoped_signature_pages.map{ |signature_page| signature_page.tree_element.id if !signature_page.is_enabled}.compact
    end
    get_signature_group.tree_element_signature_groups.each do |tree_element_signature_group|
      is_enabled = !disabled_tree_element_ids.include?(tree_element_signature_group.tree_element.id)
      tree_element_signature_group.create_signature_pages(self, is_enabled)
    end
  end

  def is_entity_signer?
    signature_entity.present?
  end

  private

  def delete_user_if_unused
    return if user.entity_users.any? || user.signing_capacities.any?
    user.destroy
  end
end
