class Api::HealthChecksController < ActionController::Base

  def index
    render json: {message: 'ok'}, status: 200
  end
end
