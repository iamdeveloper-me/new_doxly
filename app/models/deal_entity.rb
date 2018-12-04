class DealEntity < ActiveRecord::Base
  include Models::Restrictable

  belongs_to :deal
  belongs_to :entity
  has_many   :deal_entity_users, dependent: :destroy
  has_one    :primary_address, :as => :addressable, :dependent => :destroy, autosave: true
  has_many   :completion_statuses, dependent: :destroy
  has_many   :responsible_parties, dependent: :destroy
  has_many   :role_links, dependent: :destroy
  has_many   :roles, :through => :role_links

  scope :owner, -> { where(:is_owner => true) }
  scope :collaborator, -> { where(:is_owner => false) }
  validates_presence_of :deal_id, :entity_id
  validates :deal_id, uniqueness: {scope: :entity_id}

  def descendant_restrictions(tree_element)
    return [] if deal_entity_users.empty?
    klass_name = deal_entity_users.first.class.name
    tree_element.tree_element_restrictions.where(restrictable_id: deal_entity_users.pluck(:id), restrictable_type: klass_name, inherit: true)
  end

  def propagate_restriction_to_children(tree_element)
    deal_entity_users.each do |deal_entity_user|
      existing_restriction = tree_element.tree_element_restrictions.find_by(restrictable_id: deal_entity_user.id, restrictable_type: deal_entity_user.class.name)
      if existing_restriction == nil
        restriction = tree_element.tree_element_restrictions.new
        restriction.tree_element = tree_element
        restriction.restrictable = deal_entity_user
        restriction.inherit = true
        restriction.save
      end
    end
  end

  def remove_restriction_from_children(tree_element)
    deal_entity_users.each do |deal_entity_user|
      existing_restriction = tree_element.tree_element_restrictions.find_by(restrictable_id: deal_entity_user.id, restrictable_type: deal_entity_user.class.name)
      if existing_restriction&.inherit
        existing_restriction.destroy
      end
    end
  end

  def create_tree_element_restriction(role)
    return if is_owner
    role.tree_element_restrictions.each do |restriction|
      tree_element = restriction.tree_element
      existing_restrictions = tree_element_restrictions.where(['tree_element_id = ?', tree_element])
      if existing_restrictions.count == 0
        new_restriction = tree_element_restrictions.new
        new_restriction.tree_element = tree_element
        new_restriction.inherit = true
        new_restriction.save
      end
    end
  end
end
