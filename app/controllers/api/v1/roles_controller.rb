class Api::V1::RolesController < Api::V1::ApplicationController
  include Controllers::Api::DealHelpers

  api!
  def index
    check_read(:role)
    render_success(run_array_serializer(deal.roles, RoleSerializer))
  end
end
