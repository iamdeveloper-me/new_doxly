class CriticalError < ActiveRecord::Base

  belongs_to :critical_errorable, polymorphic: true, inverse_of: :critical_errors

  validates_presence_of :critical_errorable, :error_type, :user_message

  scope :unread, -> { where(:is_read => false) }

  before_save :set_user_message

  def save_new!(error_type, options={})
    exception          = options.fetch(:exception, nil)
    user_message       = options.fetch(:user_message, nil)
    self.error_type    = error_type
    self.user_message  = user_message
    # real exceptions vs custom errors
    self.error_message = exception.try(:message)
    self.error_detail  = exception
    self.backtrace     = Array(exception.try(:backtrace))[0..60].join('\r\n')
    self.save
  end

  private

  def set_user_message
    return if self.user_message
    self.user_message = "An error occurred while processing the request. Please try again."
  end

end
