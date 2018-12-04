class Api::V1::CompletionStatusesController < Api::V1::ApplicationController
  include Controllers::Api::ChecklistHelpers

  api!
  def create
    check_create(:completion_status)
    completion_status.deal_entity_id = current_entity.deal_entities.find_by(deal_id: deal.id).id
    completion_status.is_complete = params[:completion_status][:is_complete]
    if completion_status.save
      create_completion_event
      render_success(run_object_serializer(completion_status, CompletionStatusSerializer))
    else
      render_validation_failed(completion_status.errors.full_messages)
    end
  end

  api!
  def update
    check_update(:completion_status)
    render_unauthorized and return unless completion_status.deal_entity == current_entity.deal_entities.find_by(deal_id: deal.id)
    if completion_status.update(is_complete: params[:completion_status][:is_complete])
      create_completion_event
      render_success(run_object_serializer(completion_status, CompletionStatusSerializer))
    else
      render_validation_failed(completion_status.errors.full_messages)
    end
  end

  private

  def completion_status
    @completion_status ||= tree_element.completion_statuses.find_or_initialize_by(id: params[:id])
  end

  def create_completion_event
    return unless completion_status.is_complete?
    current_entity.events.create(module: 'Task', action: "TASK_COMPLETED", eventable: tree_element, entity_user_id: current_entity_user.id, associatable_type: 'Deal', associatable_id: deal.id)
  end
end
