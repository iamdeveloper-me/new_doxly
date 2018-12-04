class Api::V1::VotingInterestGroupsController < Api::V1::ApplicationController
  include Controllers::Api::DealHelpers

  api!
  def index
    check_read(:voting_threshold)
    render_success(run_array_serializer(deal.voting_interest_groups, VotingInterestGroupSerializer))
  end

  api!
  def create
    check_create(:voting_threshold)
    voting_interest_group.assign_attributes(voting_interest_group_params)
    if voting_interest_group.save
      current_entity.events.create(module: 'VotingInterestGroup', action: "VOTING_INTEREST_GROUP_ADDED", eventable: voting_interest_group, entity_user_id: current_entity_user.id, associatable_type: 'Deal', associatable_id: deal.id)
      render_success(run_object_serializer(voting_interest_group, VotingInterestGroupSerializer))
    else
      render_validation_failed(voting_interest_group.errors.full_messages)
    end
  end

  api!
  def update
    check_update(:voting_threshold)
    voting_interest_group.assign_attributes(voting_interest_group_params)
    if voting_interest_group.save
      current_entity.events.create(module: 'VotingInterestGroup', action: "VOTING_INTEREST_GROUP_UPDATED", eventable: voting_interest_group, entity_user_id: current_entity_user.id, associatable_type: 'Deal', associatable_id: deal.id)
      render_success(run_object_serializer(voting_interest_group, VotingInterestGroupSerializer))
    else
      render_validation_failed(voting_interest_group.errors.full_messages)
    end
  end

  api!
  def destroy
    check_delete(:voting_threshold)
    voting_interest_group.destroy
    render_success
  end

  private

  def voting_interest_group
    @voting_interest_group ||= params[:id].blank? ? deal.voting_interest_groups.new : deal.voting_interest_groups.find(params[:id])
  end

  def voting_interest_group_params
    params.require(:voting_interest_group).permit(:name, :total_number_of_shares)
  end

end
