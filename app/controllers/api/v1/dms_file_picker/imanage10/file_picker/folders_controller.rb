class Api::V1::DmsFilePicker::Imanage10::FilePicker::FoldersController < Api::V1::DmsFilePicker::Imanage10::FilePicker::ApplicationController

  def show
    check_read(:dms_integration)
    response = api.get_folder_contents(id: params[:id])
    render_success(response)
  end
end
