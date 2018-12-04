class SignatureEntitySerializer < ApplicationSerializer
  attributes :id, :name, :ancestry, :created_at, :updated_at, :root, :signing_authority, :title, :children, :primary_address, :copy_to_address

  belongs_to :block
  has_many :signing_capacities

  def root
    object.root
  end

  def children
    scope.to_h[:children].present? ? scope.to_h[:children] : object.children
  end
end
