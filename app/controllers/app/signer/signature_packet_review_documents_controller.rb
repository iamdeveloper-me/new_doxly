class App::Signer::SignaturePacketReviewDocumentsController < App::ApplicationController

  def view
    check_read(:none)
    path = signature_packet_review_document.view_path
    unless path
      jobs = Delayed::Job.where("handler LIKE '%gid://doxly/SignaturePacketReviewDocument/#{signature_packet_review_document.id}%'").where(queue:"signature_packet_review_document")
      if jobs.empty?
        path = "#{Rails.root}/public/viewer/web/cannot-preview.pdf"
      end
    end
    display_file(path)
  end

  def download
    # This is used for signer as well so have to use :none. Since everyone has 'R' for version anyway, it should be OK.
    check_read(:none)
    render_unauthorized and return if current_user != signature_packet_review_document.signature_packet.user
    download_path = signature_packet_review_document.download_path
    extension = File.extname(download_path)
    download_file(download_path, :filename => "#{signature_packet_review_document.name}#{extension}")
  end

  def view_document
    check_read(:none)
    @name = signature_packet_review_document.name
    tree_element = signature_packet_review_document.tree_element
    if tree_element && !tree_element.latest_version
      flash.now[:error] = "Document has not yet been uploaded"
      render 'shared/blank.js' and return
    else
      render 'signer/signature_packet_review_documents/view_document'
    end
  end

  private

  def signature_packet_review_document
    @signature_packet_review_document ||= signature_packet.signature_packet_review_documents.find(params[:id] || params[:signature_packet_review_document_id])
  end

  def signature_packet
    @signature_packet ||= current_user.signature_packets.find(params[:signature_packet_id])
  end

end
