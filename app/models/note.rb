class Note < ActiveRecord::Base

  validates_presence_of   :text
  validates_presence_of   :entity_user_id

  belongs_to :entity_user
  belongs_to :ownable,          :polymorphic => true
  belongs_to :noteable,         :polymorphic => true
  has_many   :events,           :as => :eventable, :dependent => :destroy

  delegate :deal, :to => :noteable

  scope :all_notes, -> (entity_id) {public_notes + private_notes(entity_id)}
  scope :public_notes,  -> { where(:is_public => true) }
  scope :private_notes, (lambda do |entity_id|
    where(:is_public => false).select { |note| note.entity_user.entity.id == entity_id }
  end)
  scope :recent, -> { where('created_at >= ?', 1.day.ago) }

end
