class Api::V1::VersionsController < Api::V1::ApplicationController
  include Controllers::Api::ChecklistHelpers

  api!
  def index
    check_read(:version)
    if params[:category_id].present?
      # was unable to test the categories versions on my database. Checklists don't currently have the ability to upload files.
      render_success(run_array_serializer(category.all_versions, VersionSerializer))
    else
      render_success(run_array_serializer(deal.unplaced_versions, VersionSerializer))
    end
  end

  api!
  def create
    check_create(:version)
    begin
      attachment.upload!(params[:file], current_entity_user)
      if attachment.errors.empty?
        current_entity.events.create(module: 'Deal', action: "DOCUMENT_UPDATED", eventable: tree_element, entity_user_id: current_entity_user.id, associatable_type: 'Deal', associatable_id: deal.id)
        render_success(run_object_serializer(attachment.versions.last, VersionSerializer))
      else
        raise attachment.errors.full_messages.join(', ')
      end
    rescue StandardError => e
      report_to_rollbar(e)
      latest_version = attachment.versions.last
      latest_version.destroy if latest_version && latest_version.persisted? && latest_version.version_storageable.nil?
      render_validation_failed(attachment.errors.full_messages.any? ? attachment.errors.full_messages : [t('errors.cannot_upload')])
    end
  end

  api!
  # if adding unplaced version + attachment to tree_element that already has an attachment
  def update
    check_update(:version)
    original_attachment = version.attachment
    version.assign_attributes(version_params)
    if version.save
      if (original_attachment.reload.versions.empty?)
        original_attachment.destroy
      end
      render_success(run_object_serializer(version, VersionSerializer))
    else
      render_validation_failed(version.errors.full_messages)
    end
  end

  api!
  def destroy
    check_delete(:version)
    uploading_entity = version.uploader.entity
    current_entity   = current_deal_entity_user.entity
    # can delete if is a part of owning org or the org/Individual who uploaded
    if deal.is_owning_entity?(current_entity) || uploading_entity == current_entity
      eventable = version.attachment.attachable
      version.destroy
      current_entity.events.create(module: 'Deal', action: "DOCUMENT_DELETED", eventable: eventable, entity_user_id: current_entity_user.id, associatable_type: 'Deal', associatable_id: deal.id)
      render_success
    else
      render_validation_failed(['You do not have permission to delete this version.'])
    end
  end

  def move_unplaced_version
    check_update(:version)
    original_attachment = version.attachment
    version.assign_attributes(version_params)
    if version.save
      if (original_attachment.reload.versions.empty?)
        original_attachment.destroy
      end
      CreateThumbnailsJob.perform_later(version) if version.attachment.attachable.try(:signature_required?)
      render_success(run_object_serializer(version, VersionSerializer))
    else
      render_validation_failed(version.errors.full_messages)
    end
  end

  def send_to_dms
    check_create(:dms_integration)
    version.sending_to_dms!
    SendToDmsJob.perform_later(version, current_entity_user, params)
    render_success(run_object_serializer(version, VersionSerializer))
  end

  def sync_thumbnails
    check_read(:dms_integration)
    success = version.sync_thumbnails(current_entity_user)
    version.reload
    pages = []
    # rebuild the page objects with the synched document.
    version.page_count.times do |number|
      pages << {
        name: number + 1,
        position: pages.length + 1,
        original_position: pages.length + 1,
        preview_path: ApplicationHelper.viewer_url(view_deal_category_tree_element_attachment_version_path(deal.id, deal.closing_category, tree_element, version.attachment, version), page_num: number+1)
      }
    end
    response = {
      # resend the thumbnail sprite path with a new time on the end to force the browser to refresh the image.
      thumbnail_sprite_path: document_thumbnail_sprite_path = download_thumbnail_sprite_deal_category_tree_element_attachment_version_path(deal, deal.closing_category, tree_element, version.attachment, version, time: Time.now.utc),
      pages: pages
    }
    if success
      # not a super REST-ful response, but the data that we are sending from the api::deals#documents_ready_to_be_executed isn't either and this needs to mirror that.
      render_success(response) and return
    else
      render_failure and return
    end
  end

  private

  def version_params
    params.require(:version).permit(:attachment_id, :status, :status_set_at, :position)
  end

  def version
    @version ||= if params[:category_id].present?
      category.all_versions.find{ |version| version.id == (params[:version_id] || params[:id]).to_i }
    else
      deal.unplaced_versions.find(params[:id])
    end
  end
end
