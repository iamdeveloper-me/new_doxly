class Api::V1::DmsFilePicker::NetDocuments::FilePicker::DocumentsController < Api::V1::DmsFilePicker::NetDocuments::FilePicker::ApplicationController

  def show
    check_read(:dms_integration)
    response = api.get_document({ id: URI.unescape(params[:id]) })
    render_success(response)
  end

  def recently_accessed_documents
    check_read(:dms_integration)
    response = api.get_recently_accessed_documents
    render_success(response)
  end

  def search
    check_read(:dms_integration)
    response = api.search({ query: URI.unescape(params[:query]) })
    render_success(response)
  end
end
