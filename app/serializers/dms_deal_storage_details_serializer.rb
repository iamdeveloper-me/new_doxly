class DmsDealStorageDetailsSerializer < ApplicationSerializer
  attributes :id, :deal_id, :dms_deal_storage_detailable_id, :dms_deal_storage_detailable_type, :created_at, :updated_at

  has_one :dms_deal_storage_detailable
end
