module Controllers::TimeZoneable
  extend ActiveSupport::Concern

  def save_user_timezone(user)
    if user && cookies[:timezone] && user.time_zone != cookies[:timezone]
      user.bypass_password_validation = true
      user.update(time_zone: cookies[:timezone])
    end
  end
end
