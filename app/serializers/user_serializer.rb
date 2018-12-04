class UserSerializer < ApplicationSerializer
  attributes :id, :first_name, :last_name, :name, :avatar, :phone, :address, :city, :state, :zip, :email, :created_at, :updated_at, :otp_required_for_login

  has_many :signing_capacities
  has_many :entities

  def name
    object.name
  end

  def signing_capacities
    object.signing_capacities.select{ |signing_capacity| signing_capacity.deal == scope[:deal] }
  end
end
