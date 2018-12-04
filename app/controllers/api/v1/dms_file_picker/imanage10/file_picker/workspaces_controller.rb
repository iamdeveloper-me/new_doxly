class Api::V1::DmsFilePicker::Imanage10::FilePicker::WorkspacesController < Api::V1::DmsFilePicker::Imanage10::FilePicker::ApplicationController

  def matter_worklist
    check_read(:dms_integration)
    response = api.get_matter_worklist
    render_success(response)
  end

  def show
    check_read(:dms_integration)
    response = api.get_workspace_contents(id: params[:id])
    render_success(response)
  end

  def my_favorites
    check_read(:dms_integration)
    response = api.get_my_favorites
    render_success(response)
  end

  def my_matters
    check_read(:dms_integration)
    response = api.get_my_matters
    render_success(response)
  end
end
