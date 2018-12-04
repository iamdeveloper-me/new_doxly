class Api::V1::DmsFilePicker::Imanage10::FilePicker::DocumentsController < Api::V1::DmsFilePicker::Imanage10::FilePicker::ApplicationController

  def versions_list
    check_read(:dms_integration)
    response = api.get_versions_list({ document_id: URI.unescape(params[:document_id]) })
    render_success(response)
  end

  def document_worklist
    check_read(:dms_integration)
    response = api.get_recent_documents
    render_success(response)
  end

  def search
    check_read(:dms_integration)
    response = api.search({ query: URI.unescape(params[:query]) })
    render_success(response)
  end
end
