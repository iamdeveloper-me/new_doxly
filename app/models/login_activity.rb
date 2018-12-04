class LoginActivity < ActiveRecord::Base

  ALLOWED_ACTIVITIES = ['login', 'logout']

  belongs_to :user

  validates_presence_of :user, :email, :activity, :ip_address, :user_agent

  before_validation :set_email

  def self.create_new!(activity, user, auth)
    return unless user
    # we don't want this to break
    begin
      request = auth.request
      user.login_activities.create(activity: activity, ip_address: request.remote_ip, user_agent: request.user_agent, referrer: request.referrer)
    rescue StandardError => e
      # record error
      user.critical_errors.new.save_new!(:login_activity_error, { exception: e })
    end
  end

  private

  def set_email
    self.email = self.user.email if self.user.present?
  end

end