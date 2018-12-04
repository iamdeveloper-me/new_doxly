class MakeAllDataRoomSectionsFolders < ActiveRecord::Migration
  def change
    DiligenceCategory.all.each do |dc|
      dc.descendants.each do |descendant|
        if descendant.type == "Section"
          descendant.type = "Folder"
          descendant.save!
        end
      end
    end
  end
end