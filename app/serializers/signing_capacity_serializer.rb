class SigningCapacitySerializer < ApplicationSerializer
  attributes :id, :title, :placeholder_id, :user, :name, :first_name, :last_name, :signature_group, :primary_address, :copy_to_address, :has_sent_packets

  belongs_to :user
  belongs_to :signature_group
  belongs_to :signature_entity
  belongs_to :block
  has_many   :signature_pages

  def user
    object.user
  end

  def name
    object.name
  end

  def signature_group
    object.get_signature_group
  end

  def has_sent_packets
    object.has_sent_packets?
  end
end
