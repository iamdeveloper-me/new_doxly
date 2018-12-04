class AttachmentSerializer < ApplicationSerializer
  attributes :id, :created_at, :updated_at

  has_many :versions
  has_one :latest_version
  belongs_to :attachable
end
