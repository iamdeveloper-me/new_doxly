class Api::V1::ApplicationController < Api::ApplicationController

  def current_entity_user
    # TODO: Clean this up to use params or make everything else use headers
    @current_entity_user ||= current_user.entity_users.find_by :id => request.headers["X-Entity-User-Id"]
  end

  def current_entity
    @current_entity ||= current_entity_user.entity
  end

end
