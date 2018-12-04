class PopulateSignaturePageExecutionTable < ActiveRecord::Migration
  def change
    deals = Deal.where('created_at > ?', 6.months.ago)
    deals.each do |deal|
      puts "deal #{deal.id}"
      deal.closing_category.all_versions.select{|version| version.status == 'executed'}.each do |executed_version|
        puts "executed_version #{executed_version.id}"
        tree_element = executed_version.attachment.attachable
        next unless tree_element && tree_element.is_a?(TreeElement)
        executed_signature_pages = tree_element.signature_pages.where(signature_status: ['executed'])
        executed_signature_pages.each do |executed_signature_page|
          puts "signature_page #{executed_signature_page.id}"
          spe = SignaturePageExecution.create!(version_id: executed_version.id, signature_page_id: executed_signature_page.id, created_at: executed_version.created_at, updated_at: executed_version.created_at)
          puts "created signature_page_execution #{spe.id}"
        end
      end
    end
  end
end
