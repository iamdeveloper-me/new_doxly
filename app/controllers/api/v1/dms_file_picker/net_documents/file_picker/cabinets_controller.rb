class Api::V1::DmsFilePicker::NetDocuments::FilePicker::CabinetsController < Api::V1::DmsFilePicker::NetDocuments::FilePicker::ApplicationController

  def index
    check_read(:dms_integration)
    api = NetDocumentsApi.new(current_entity_user)
    response = api.get_cabinets
    render_success(response)
  end

  def folders
    check_read(:dms_integration)
    api = NetDocumentsApi.new(current_entity_user)
    response = api.get_cabinet_folders({id: params[:id]})
    render_success(response)
  end
end
