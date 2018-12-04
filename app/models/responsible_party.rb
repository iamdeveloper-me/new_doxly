class ResponsibleParty < ActiveRecord::Base
  belongs_to :tree_element
  belongs_to :deal_entity
  belongs_to :deal_entity_user

  validates_presence_of :tree_element, :deal_entity
  validates :is_active, exclusion: { in: [nil] }
  validates_uniqueness_of :tree_element, { scope: :deal_entity}
  validate :not_third_responsible_party_on_tree_element
  validate :deal_entity_user_belongs_to_deal_entity
  validate :deal_entity_belongs_to_deal


  before_save :flip_responsible_party

  def not_third_responsible_party_on_tree_element
    self.errors.add(:tree_element, :cannot_be_third) if tree_element.responsible_parties.length > 2
  end

  def deal_entity_user_belongs_to_deal_entity
    self.errors.add(:deal_entity_user, :must_match_deal_entity) if self.deal_entity && self.deal_entity_user && !self.deal_entity.deal_entity_users.include?(deal_entity_user)
  end

  def deal_entity_belongs_to_deal
    self.errors.add(:deal_entity, :must_match_deal) if self.deal_entity && !(self.tree_element.deal == self.deal_entity.deal)
  end

  def flip_responsible_party
    other_responsible_party = tree_element.responsible_parties.where.not(id: self.id).first
    if self.is_active && other_responsible_party&.is_active
      other_responsible_party.is_active = false
      other_responsible_party.save
    end
  end
end
