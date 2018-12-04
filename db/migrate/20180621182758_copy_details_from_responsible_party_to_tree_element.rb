class CopyDetailsFromResponsiblePartyToTreeElement < ActiveRecord::Migration
  def change
    ResponsibleParty.where.not(text: nil).each do |responsible_party|
      responsible_party.tree_element.update_attributes!(details: responsible_party.text)
    end
  end
end
