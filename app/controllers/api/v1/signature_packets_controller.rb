class Api::V1::SignaturePacketsController < Api::V1::ApplicationController
  include Controllers::Api::DealHelpers

  api!
  def create
    check_create(:signature_management)
    user = deal.signers.select{ |signer| signer.id == params[:signature_packet][:user_id] }.first
    render_unauthorized unless user
    packet_type = signature_packet_params[:packet_type]
    is_docusign = params[:type] == 'docusign'
    if is_docusign
      signature_packet = user.incomplete_docusign_packet_on_deal(deal.id, packet_type) || user.signature_packets.new(signature_packet_params)
    else
      signature_packet = user.incomplete_manual_packet_on_deal(deal.id, packet_type) || user.signature_packets.new(signature_packet_params)
    end
    signature_packet.packet_type = packet_type
    # set here anyway
    signature_packet.message = signature_packet_params[:message]
    url = is_docusign ? esignature_notifications_url : nil
    signature_packet.send!(user, is_docusign, current_entity_user, {esignature_notifications_url: url, new_signature_packet_review_documents: Array(params[:signature_packet][:signature_packet_review_documents])})
    render_success
  end

  private

  def signature_packet_params
    params.require(:signature_packet).permit(:packet_type, :copy_to, :message, :deal_id)
  end
end
