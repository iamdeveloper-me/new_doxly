class NetDocumentsDealStorageDetails < ActiveRecord::Base
  has_one :dms_deal_storage_details, as: :dms_deal_storage_detailable

  def create_or_update!(attributes)
    assign_attributes(attributes)
    save
    self
  end
end
