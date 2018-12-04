class Api::V1::DmsFilePicker::NetDocuments::VersionsController < Api::V1::DmsFilePicker::ApplicationController
  include Controllers::Api::ChecklistHelpers

  def create
    check_create(:dms_integration)
    nd_version_storage = NetDocumentsVersionStorage.new(nd_version_object: JSON.parse(params[:dms_object]))
    nd_version_storage.create_version_from_nd_version_object!(attachment, current_entity_user)
    version = nd_version_storage.version
    if nd_version_storage.version.errors.empty?
      current_entity.events.create(module: 'Deal', action: "DOCUMENT_UPDATED", eventable: tree_element, entity_user_id: current_entity_user.id, associatable_type: 'Deal', associatable_id: deal.id)
      render_success(run_object_serializer(version, VersionSerializer))
    else
      render_validation_failed(version.errors.full_messages)
    end
  end
end
