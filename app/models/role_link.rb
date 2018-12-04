class RoleLink < ActiveRecord::Base
  belongs_to :role
  belongs_to :deal_entity
  validates_presence_of :role
  validates :role_id, uniqueness: { scope: [:deal_entity_id]}
  validate :deals_match

  def deals_match
    errors.add(:deals, "must match") unless deal_entity.deal == role&.roleable
  end

end
