class App::Client::EntitiesController < App::ApplicationController

  def index
    check_read(:entity)
    @entity_connections = current_entity.entity_connections.firms
    @are_law_firms = true
  end

  protected

  def module_to_validate
    :has_my_entity
  end

end
