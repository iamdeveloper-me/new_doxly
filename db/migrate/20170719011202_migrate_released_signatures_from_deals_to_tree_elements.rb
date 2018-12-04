class MigrateReleasedSignaturesFromDealsToTreeElements < ActiveRecord::Migration
  def change
    Deal.where(released_signatures: true).each do |deal|
      tree_elements = deal.closing_category.descendants.signature_required.select { |tree_element| tree_element.released_signatures? }
      tree_elements.each do |tree_element|
        tree_element.released_signatures = true
        tree_element.released_signatures_deal_entity_user_id = deal.deal_entity_user_for(deal.released_signatures_entity_user_id)
        tree_element.released_signatures_at = deal.updated_at
        tree_element.save!
      end
    end

    remove_column :deals, :released_signatures
    remove_column :deals, :released_signatures_entity_user_id
  end
end
