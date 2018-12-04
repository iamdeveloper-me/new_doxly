class Api::V1::DealEntityUsersController < Api::V1::ApplicationController
  include Controllers::Api::DealHelpers

  api!
  def index
    check_read(:entity_user)
    render_success(run_object_serializer(deal_entity.deal_entity_users, DealEntityUserSerializer))
  end

  api!
  def show
    check_read(:entity_user)
    render_success(run_object_serializer(deal_entity_user, DealEntityUserSerializer))
  end

  private

  def deal_entity_user
    @deal_entity_user ||= begin
      return current_deal_entity_user if params[:id] === 'current'
      params[:id].blank? ? deal_entity.deal_entity_users.new : deal_entity.deal_entity_users.find_by(id: params[:id])
    end
  end
end
