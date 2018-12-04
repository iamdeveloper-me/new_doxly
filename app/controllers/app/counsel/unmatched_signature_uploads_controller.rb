class App::Counsel::UnmatchedSignatureUploadsController < App::ApplicationController

  def index
    check_read(:deals)
  end

end
