class Api::V1::VotingInterestThresholdsController < Api::V1::ApplicationController
  include Controllers::Api::DealHelpers

  api!
  def create
    check_create(:voting_threshold)
    voting_interest_threshold.assign_attributes(voting_interest_threshold_params)
    if voting_interest_threshold.save
      current_entity.events.create(module: 'VotingInterestThreshold', action: "VOTING_INTEREST_THRESHOLD_ADDED", eventable: voting_interest_threshold, entity_user_id: current_entity_user.id, associatable_type: 'Deal', associatable_id: deal.id)
      render_success(run_object_serializer(voting_interest_threshold, VotingInterestThresholdSerializer))
    else
      render_validation_failed(voting_interest_threshold.errors.full_messages)
    end
  end

  api!
  def update
    check_update(:voting_threshold)
    voting_interest_threshold.assign_attributes(voting_interest_threshold_params)
    if voting_interest_threshold.save
      current_entity.events.create(module: 'VotingInterestThreshold', action: "VOTING_INTEREST_THRESHOLD_UPDATED", eventable: voting_interest_threshold, entity_user_id: current_entity_user.id, associatable_type: 'Deal', associatable_id: deal.id)
      render_success(run_object_serializer(voting_interest_threshold, VotingInterestThresholdSerializer))
    else
      render_validation_failed(voting_interest_threshold.errors.full_messages)
    end
  end

  api!
  def destroy
    check_delete(:voting_threshold)
    voting_interest_threshold.destroy
    render_success
  end

  private

  def voting_interest_threshold
    @voting_interest_threshold ||= params[:id].blank? ? voting_interest_group.voting_interest_thresholds.new : voting_interest_group.voting_interest_thresholds.find(params[:id])
  end

  def voting_interest_group
    @voting_interest_group ||= deal.voting_interest_groups.find(params[:voting_interest_group_id])
  end

  def voting_interest_threshold_params
    params.require(:voting_interest_threshold).permit(:threshold, :document_id)
  end

end
