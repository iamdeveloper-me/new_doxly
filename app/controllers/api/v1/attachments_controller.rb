class Api::V1::AttachmentsController < Api::V1::ApplicationController
  include Controllers::Api::ChecklistHelpers

  api!
  def create
    check_create(:attachment)
    begin
      attachment.upload!(params[:file], current_entity_user)
      if attachment.errors.empty?
        current_entity.events.create(module: 'Deal', action: "DOCUMENT_UPDATED", eventable: tree_element, entity_user_id: current_entity_user.id, associatable_type: 'Deal', associatable_id: deal.id)
        render_success(run_object_serializer(attachment, AttachmentSerializer))
      else
        raise attachment.errors.full_messages.join(', ')
      end
    rescue StandardError => e
      report_to_rollbar(e)
      attachment.destroy if attachment && attachment.persisted?
      render_validation_failed(attachment.errors.full_messages.any? ? attachment.errors.full_messages : [t('errors.cannot_upload')])
    end
  end

  api!
  def destroy
    check_delete(:attachment)
    attachment.destroy
    render_success
  end

  api!
  def move_unplaced_attachment
    check_update(:attachment)
    attachment = deal.unplaced_attachments.find(params[:id])
    attachment.assign_attributes(attachment_params)
    if attachment.save
      CreateThumbnailsJob.perform_later(attachment.latest_version) if attachment.attachable.try(:signature_required?)
      render_success(run_object_serializer(attachment, AttachmentSerializer))
    else
      render_validation_failed(attachment.errors.full_messages)
    end
  end

  private

  def attachment
    @attachment ||= tree_element.attachment ? tree_element.attachment : tree_element.build_attachment
  end

  def attachment_params
    params.require(:attachment).permit(:attachable_id, :attachable_type)
  end

  def version_params
    params.require(:version).permit(:file)
  end
end
