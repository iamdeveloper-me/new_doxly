class ConvertAllDataRoomTasksToFolders < ActiveRecord::Migration
  def change
    DiligenceCategory.all.each do |diligence_category|
      diligence_category.descendants.each do |tree_element|
        if tree_element.type == "Task"
          tree_element.type = "Folder"
          tree_element.save
        end
      end
    end
  end
end
