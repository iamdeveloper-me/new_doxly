class SignaturePageSerializer < ApplicationSerializer

  attributes :id,
             :unique_key,
             :signature_status,
             :signature_status_timestamp,
             :is_custom,
             :packet_page_number,
             :is_enabled,
             :is_executing,
             :created_at,
             :updated_at,
             :currently_executed

  belongs_to :signing_capacity
  belongs_to :signature_page_collection
  has_one    :tree_element
  belongs_to :signature_packet

  def currently_executed
    object.currently_executed?
  end

end
