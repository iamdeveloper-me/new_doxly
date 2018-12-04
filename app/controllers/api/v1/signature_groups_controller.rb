class Api::V1::SignatureGroupsController < Api::V1::ApplicationController
  include Controllers::Api::DealHelpers
  include Controllers::OwningEntity

  api!
  def index
    check_read(:signature_management)
    signature_groups = deal.signature_groups.order(:id)
    render_success(run_array_serializer(signature_groups, SignatureGroupSerializer))
  end

  api!
  def create
    check_create(:signature_management)
    render_validation_failed(["Cannot add signature groups after deal has been closed."]) and return if deal.closed?
    signature_group.assign_attributes(signature_group_params)
    if signature_group.save
      render_success(run_object_serializer(signature_group, SignatureGroupSerializer))
    else
      render_validation_failed(signature_group.errors.full_messages)
    end
  end

  api!
  def update
    check_update(:signature_management)
    render_validation_failed(["Cannot edit signature groups after deal has been closed."]) and return if deal.closed?
    signature_group.assign_attributes(signature_group_params)

    # save the record
    if signature_group.save
      render_success(run_object_serializer(signature_group, SignatureGroupSerializer))
    else
      render_validation_failed(signature_group.errors.full_messages)
    end
  end

  api!
  def destroy
    check_delete(:signature_management)
    render_unauthorized and return unless current_entity_user.entity == deal.owner_entity
    render_validation_failed(["Cannot delete signature groups after deal has been closed."]) and return if deal.closed?
    if signature_group.signing_capacities.empty? && signature_group.signature_entities.empty?
      signature_group.destroy
      render_success
    else
      render_validation_failed(["Cannot delete a Signature Group with active users."])
    end
  end

  private

  def signature_group
    @signature_group ||= params[:id].blank? ? deal.signature_groups.new : deal.signature_groups.find(params[:id])
  end

  def signature_group_params
    params.require(:signature_group).permit(:name, :deal_id)
  end
end
