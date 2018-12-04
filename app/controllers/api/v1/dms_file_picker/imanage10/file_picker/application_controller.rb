class Api::V1::DmsFilePicker::Imanage10::FilePicker::ApplicationController < Api::V1::DmsFilePicker::ApplicationController
  include Controllers::Api::DealHelpers
  
  protected

  def api
    @api ||= Imanage10Api.new(current_entity_user)
  end
end
