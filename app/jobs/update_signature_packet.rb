class UpdateSignaturePacket < ApplicationJob
  queue_as :update_signature_packet

  def perform(signature_packet)
    # create new pdf file
    pdf = CombinePDF.new

    # download all signed pages and recreate the packet.

    # uniq by unique_key to avoid physical page duplication in the signed_packet.
    signature_pages = signature_packet.signature_pages.where(signature_status: 'signed').to_a.uniq(&:unique_key)
    signature_pages.map {|signature_page| pdf << CombinePDF.load(signature_page.signed_aws_file.path, allow_optional_content: true)}

    # save the temp file
    generated_packets_path = "#{ApplicationHelper.signature_management_root}/deal_#{signature_packet.deal.id}/manual_signatures/generated_packets"
    FileUtils.mkdir_p(generated_packets_path) unless Dir.exist?(generated_packets_path)
    pdf_path = "#{generated_packets_path}/generated_signature_packet_#{signature_packet.id}.pdf".gsub(/ /, '_')
    pdf.save pdf_path

    # save to aws
    pdf_file = File.open(pdf_path)
    begin
      unless signature_packet.upload!(pdf_file, 'signed')
        raise "unable to save #{pdf_path} to the signature packet #{signature_packet.id}"
      end
    ensure
      pdf_file.close if pdf_file
      File.delete(pdf_path) if File.exist?(pdf_path.to_s)
    end
  end
end
