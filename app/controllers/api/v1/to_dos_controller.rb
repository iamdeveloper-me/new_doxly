class Api::V1::ToDosController < Api::V1::ApplicationController
  include Controllers::Api::ChecklistHelpers
  include Controllers::DueDateable

  api!
  def index
    check_read(:to_do)
    all_todos     = tree_element.to_dos
    scoped_to_dos = all_todos.my_todos(current_deal_entity_user.id) + all_todos.team_todos(current_deal_entity.id)
    render_success(run_array_serializer(scoped_to_dos.uniq, ToDoSerializer))
  end

  api!
  def create
    check_create(:to_do)
    create_or_update_to_do
  end

  api!
  def update
    check_update(:to_do)
    create_or_update_to_do
  end

  api!
  def destroy
    check_delete(:to_do)
    to_do.destroy
    render_success(run_object_serializer(to_do, ToDoSerializer))
  end

  private

  def create_or_update_to_do
    initial_deal_entity_user_id = to_do.deal_entity_user_id
    to_do.assign_attributes(to_do_params)
    to_do.deal_entity_id = current_deal_entity.id
    to_do.creator_id     = current_deal_entity_user.id unless to_do.persisted?
    process_due_date(to_do)
    if to_do.save
      render_success(run_object_serializer(to_do, ToDoSerializer))
    else
      render_validation_failed(to_do.errors.full_messages)
    end
    send_notification_email if initial_deal_entity_user_id != to_do.deal_entity_user_id
  end

  def send_notification_email
    if to_do.deal_entity_user_id && (to_do.deal_entity_user_id != current_deal_entity_user.id)
      NotificationMailer.to_do_assigned_email(to_do).deliver_later
    end
  end

  def to_do_params
    params.require(:to_do).permit(:deal_entity_user_id, :due_dates, :is_complete, :text, :position)
  end

  def to_do
    @to_do ||=  params[:id].blank? ? tree_element.to_dos.new : tree_element.to_dos.find(params[:id])
  end
end
