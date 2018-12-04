class App::Client::EntityConnectionsController < App::ApplicationController
  include Controllers::EntityConnections
  
  def confirm_entity_connection
    check_create(:entity_connection)
    EntityConnection.where("confirmation_token = ?", params[:confirmation_token]).each do |entity_connection|
      entity_connection.is_pending = false
      entity_connection.save
    end
    flash[:success] = "Connection Confirmed"
    redirect_to entities_path
  end

end
