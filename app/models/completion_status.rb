class CompletionStatus < ActiveRecord::Base

  belongs_to :deal_entity
  belongs_to :tree_element

  validates_presence_of :deal_entity, :tree_element
  validates :is_complete, exclusion: { in: [nil] }
  validates_uniqueness_of :tree_element, { scope: :deal_entity, message: :uniqueness_by_deal_entity }
  validate :one_per_tree_element_on_closing
  validate :only_owning_entity_can_set_on_closing

  def one_per_tree_element_on_closing
    if tree_element && tree_element.root.is_a?(ClosingCategory) && tree_element.completion_statuses.length > 1
      self.errors.add(:is_complete, :already_exists)
    end
  end

  def only_owning_entity_can_set_on_closing
    if tree_element && tree_element&.root&.is_a?(ClosingCategory) && !deal_entity.is_owner?
      self.errors.add(:is_complete, :only_set_by_owner)
    end
  end

end
