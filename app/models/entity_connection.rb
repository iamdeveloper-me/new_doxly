class EntityConnection < ActiveRecord::Base

  belongs_to :my_entity, :class_name => 'Entity', :foreign_key => :my_entity_id
  belongs_to :connected_entity, :class_name => 'Entity', :foreign_key => :connected_entity_id

  scope :firms, -> { joins(:connected_entity).where(:entities => { :is_counsel => true }).order('name') }
  scope :parties, -> { joins(:connected_entity).where.not(:entities => { :is_counsel => true }).order('name') }

  validates :my_entity_id, uniqueness: {scope: :connected_entity_id}

end
