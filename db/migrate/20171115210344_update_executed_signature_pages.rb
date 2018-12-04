class UpdateExecutedSignaturePages < ActiveRecord::Migration
  def change
    SignaturePage.where(signature_status: 'executed').each do |page|
      page.signature_status = 'signed'
      page.signature_status_timestamp = page.signature_packet.completed_at
      page.save!
    end
  end
end
