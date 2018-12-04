class Api::V1::SignaturePagesController < Api::V1::ApplicationController
  include Controllers::Api::DealHelpers

  def ready_to_send
    check_create(:signature_management)
    render_unauthorized and return unless deal
    user = User.find(params[:user_id])
    signature_pages = user.signature_pages.ready_to_send.select{|signature_page| signature_page.signing_capacity.get_signature_group.deal_id == deal.id}
    render_success(run_array_serializer(signature_pages, SignaturePageSerializer))
  end
end
