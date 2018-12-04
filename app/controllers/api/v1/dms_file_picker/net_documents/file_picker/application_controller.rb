class Api::V1::DmsFilePicker::NetDocuments::FilePicker::ApplicationController < Api::V1::DmsFilePicker::ApplicationController
  include Controllers::Api::DealHelpers

  protected

  def api
    @api ||= NetDocumentsApi.new(current_entity_user)
  end
end
