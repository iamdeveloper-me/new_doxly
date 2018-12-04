class Api::V1::DmsFilePicker::SeeUnityImanage::VersionsController < Api::V1::DmsFilePicker::ApplicationController
  include Controllers::Api::ChecklistHelpers

  def create
    check_create(:dms_integration)
    see_unity_imanage_version_storage = SeeUnityImanageVersionStorage.new(see_unity_imanage_version_object: JSON.parse(params[:dms_object]))
    see_unity_imanage_version_storage.create_version_from_see_unity_imanage_version_object!(attachment, current_entity_user)
    version = see_unity_imanage_version_storage.version
    if see_unity_imanage_version_storage.version.errors.empty?
      current_entity.events.create(module: 'Deal', action: "DOCUMENT_UPDATED", eventable: tree_element, entity_user_id: current_entity_user.id, associatable_type: 'Deal', associatable_id: deal.id)
      render_success(run_object_serializer(version, VersionSerializer))
    else
      render_validation_failed(version.errors.full_messages)
    end
  end
end
