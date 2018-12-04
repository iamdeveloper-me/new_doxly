class Api::V1::DmsFilePicker::NetDocuments::FilePicker::WorkspacesController < Api::V1::DmsFilePicker::NetDocuments::FilePicker::ApplicationController

  def index
    check_read(:dms_integration)
    if params[:type] == 'recent_workspaces'
      response = api.get_recent_workspaces
    else
      response = api.get_favorite_workspaces
    end
    render_success(response)
  end

  def show
    check_read(:dms_integration)
    response = api.get_workspace_documents({id: URI.unescape(params[:id])})
    render_success(response)
  end
end
