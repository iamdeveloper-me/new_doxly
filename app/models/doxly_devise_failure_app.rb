class DoxlyDeviseFailureApp < Devise::FailureApp
  def redirect_url
    if request.xhr?
      flash[:timedout] = true if (warden_message == :timeout) && is_flashing_format?
      send(:"new_user_session_path", :format => :js)
    else
      super
    end
  end
end