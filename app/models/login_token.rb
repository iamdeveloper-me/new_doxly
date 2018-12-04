class LoginToken < ActiveRecord::Base
  belongs_to :user
  belongs_to :deal

  validates_presence_of :user

  before_save :generate_token

  scope :active, -> { where(:is_active => true).first }

  private

  def generate_token
    self.token = SecureRandom.uuid
  end
end