class TreeElementRestriction < ActiveRecord::Base
  belongs_to :tree_element
  belongs_to :restrictable, polymorphic: true

  validates_presence_of :tree_element
  validates_presence_of :restrictable
  validate              :cannot_restrict_owning_entity

  after_destroy :remove_restriction_from_children

  def propagate_restriction_to_children
    restrictable.propagate_restriction_to_children(tree_element)
  end

  private

  def remove_restriction_from_children
    restrictable.remove_restriction_from_children(tree_element)
  end

  def cannot_restrict_owning_entity
    case restrictable_type
    when 'DealEntity'
      errors.add(:base, 'Cannot restrict owning entity') if restrictable.is_owner
    when 'DealEntityUser'
      errors.add(:base, 'Cannot restrict member of owning entity') if restrictable.deal_entity.is_owner
    end
  end
end
