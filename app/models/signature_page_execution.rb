class SignaturePageExecution < ActiveRecord::Base
  belongs_to :version
  belongs_to :signature_page
  has_one    :signing_capacity, through: :signature_page
  has_one    :user, through: :signing_capacity
  validates_presence_of :version, :signature_page
  validate :read_only
  validate :version_must_be_in_the_checklist

  def read_only
    unless self.new_record?
      self.errors.add(:base, :read_only)
    end
  end

  def version_must_be_in_the_checklist
    unless version.attachment.attachable.is_a?(TreeElement)
      self.errors.add(:version, :must_be_in_the_checklist)
    end
  end
end
