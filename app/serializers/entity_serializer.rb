class EntitySerializer < ApplicationSerializer
  attributes :id, :name, :is_counsel, :type, :created_at, :updated_at, :otp_required_for_login

  def otp_required_for_login
    if object == scope[:current_entity]
      object.otp_required_for_login?
    else
      'restricted'
    end
  end
end
