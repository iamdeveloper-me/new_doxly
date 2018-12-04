class StarredDeal < ActiveRecord::Base
  belongs_to :deal
  belongs_to :entity_user
  validates :deal_id,              :presence => true, :uniqueness => { :scope => :entity_user_id }
  validates :entity_user_id, :presence => true

  scope :active, -> { joins(:deal).where(:deals => { :status => Deal::ACTIVE_STATUSES }).uniq }
end
