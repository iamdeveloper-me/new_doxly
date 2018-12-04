class DmsDealStorageDetails < ActiveRecord::Base
  belongs_to :deal
  belongs_to :dms_deal_storage_detailable, polymorphic: true
  validates_presence_of :deal, :dms_deal_storage_detailable
end
