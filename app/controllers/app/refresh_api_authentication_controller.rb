class App::RefreshApiAuthenticationController < App::ApplicationController

  def index
    check_read(:none)
    # nothing really to do here as the :before_action in App:ApplicationController takes care of regenerating the missing cookie
    if cookies[:authentication].present?
      response = { ok: true }
    else
      response = { ok: false }
    end
    render json: response
  end

end