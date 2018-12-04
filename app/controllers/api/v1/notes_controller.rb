class Api::V1::NotesController < Api::V1::ApplicationController
  include Controllers::Api::ChecklistHelpers

  api!
  def index
    check_read(:note)
    render_success(run_array_serializer(tree_element.notes.all_notes(current_entity_user.entity_id), NoteSerializer))
  end

  api!
  def create
    check_create(:note)
    note.assign_attributes(note_params)
    # will have to change to current_entity_users.find_by(entity_id: params[:entity_id]).id when we support multiple current_entity_users
    note.entity_user_id = current_entity_user.id
    if note.save
      current_entity.events.create(module: 'Note', action: "NOTE_ADDED", eventable: note, entity_user_id: current_entity_user.id, associatable_type: 'Deal', associatable_id: deal.id)
      render_success(run_object_serializer(note, NoteSerializer))
    else
      render_validation_failed(note.errors.full_messages)
    end
  end

  api!
  def destroy
    check_delete(:note)
    # will have to change to current_entity_users.include?(note.entity_user)
    if note.entity_user_id == current_entity_user.id
      note.destroy
      render_success
    else
      render_validation_failed([t('validation_errors.delete_notes')])
    end
  end

  private

  def note
    @note ||= params[:id].blank? ? tree_element.notes.new : tree_element.notes.find(params[:id])
  end

  def note_params
    params.require(:note).permit(:text, :is_public)
  end

end
