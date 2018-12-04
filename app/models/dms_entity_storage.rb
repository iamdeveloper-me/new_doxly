# ========== JUST A CONNECTING FUNCTION TO INDIVIDUAL DMS ENTITY STORAGES ==========
class DmsEntityStorage < ActiveRecord::Base
  belongs_to :entity
  belongs_to :dms_entity_storageable, polymorphic: true

  validates_presence_of :dms_entity_storageable
end
