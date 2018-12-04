class ConvertSignaturePageStatusFromReleasedToExecuted < ActiveRecord::Migration
  def change
    SignaturePage.all.each do |signature_page|
      if signature_page.signature_status == "released"
        signature_page.signature_status = "executed"
        signature_page.save
      end
    end
  end
end
