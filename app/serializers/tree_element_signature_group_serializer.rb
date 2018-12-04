class TreeElementSignatureGroupSerializer < ApplicationSerializer
  attributes :id, :alias, :created_at, :updated_at, :show_group_name

  belongs_to :tree_element
  belongs_to :signature_group
end
