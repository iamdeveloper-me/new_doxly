class Api::V1::DmsFilePicker::SeeUnityImanage::FilePicker::ApplicationController < Api::V1::DmsFilePicker::ApplicationController
  include Controllers::Api::DealHelpers
  
  protected

  def api
    @api ||= SeeUnityImanageApi.new(current_entity_user)
  end
end
