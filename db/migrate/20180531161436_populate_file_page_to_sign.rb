class PopulateFilePageToSign < ActiveRecord::Migration
  def change
    SignaturePage.all.select{ |signature_page| signature_page.sent? }.each do |sent_signature_page|
      sent_signature_page.update(file_page_to_sign: 1)
    end
  end
end
