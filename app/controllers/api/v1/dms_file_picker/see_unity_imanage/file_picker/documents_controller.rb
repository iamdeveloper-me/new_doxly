class Api::V1::DmsFilePicker::SeeUnityImanage::FilePicker::DocumentsController < Api::V1::DmsFilePicker::SeeUnityImanage::FilePicker::ApplicationController

  def versions_list
    check_read(:dms_integration)
    response = api.get_versions_list({ id: URI.unescape(params[:document_id]) })
    render_success(response)
  end

  def search
    check_read(:dms_integration)
    response = api.search({ query: URI.unescape(params[:query]) })
    render_success(response)
  end

  def show
    check_read(:dms_integration)
    response = api.get_element_profile({ id: URI.unescape(params[:id]) })
    render_success(response)
  end

  def document_worklist
    check_read(:dms_integration)
    response = api.get_recent_documents
    render_success(response)
  end
end
