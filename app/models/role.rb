class Role < ActiveRecord::Base
  include Models::Restrictable

  belongs_to :roleable, polymorphic: true
  has_many :role_links, :autosave => true, :inverse_of => :role, dependent: :destroy
  has_many :deal_entities, through: :role_links
  has_many :entities, through: :deal_entities
  has_many :deal_entity_users, through: :deal_entities
  
  validates_presence_of :name
  validates_presence_of :roleable
  validates :name, uniqueness: { scope: [:roleable_id, :roleable_type], case_sensitive: false}
  
  before_validation :strip_whitespace

  def descendant_restrictions(tree_element)
    return [] if deal_entities.empty?
    klass_name = deal_entities.first.class.name
    restrictions = tree_element.tree_element_restrictions.where(restrictable_id: deal_entities.pluck(:id), restrictable_type: klass_name, inherit: true)
    deal_entities.each do |deal_entity|
      restrictions = restrictions + deal_entity.descendant_restrictions(tree_element)
    end
    restrictions
  end

  def propagate_restriction_to_children(tree_element)
    deal_entities.each do |deal_entity|
      next if deal_entity.is_owner
      existing_restriction = tree_element.tree_element_restrictions.find_by(restrictable_id: deal_entity.id, restrictable_type: deal_entity.class.name)
      if existing_restriction == nil
        restriction = tree_element.tree_element_restrictions.new
        restriction.tree_element = tree_element
        restriction.restrictable = deal_entity
        restriction.inherit = true
        restriction.save
        deal_entity.propagate_restriction_to_children(tree_element)
      end
    end
  end

  def remove_restriction_from_children(tree_element)
    deal_entities.each do |deal_entity|
      existing_restriction = tree_element.tree_element_restrictions.find_by(restrictable_id: deal_entity.id, restrictable_type: deal_entity.class.name)
      if existing_restriction&.inherit
        existing_restriction.destroy
      end
    end
  end

  private

  def strip_whitespace
    self.name = self.name.strip unless self.name.nil?
  end
end
