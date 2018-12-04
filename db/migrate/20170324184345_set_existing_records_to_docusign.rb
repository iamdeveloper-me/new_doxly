class SetExistingRecordsToDocusign < ActiveRecord::Migration
  def change
    tree_elements_table = Arel::Table.new(:tree_elements)
    tree_elements_sql = tree_elements_table.where(tree_elements_table[:sign_manually].eq(nil)).project(Arel.sql("*")).to_sql
    tree_elements = ActiveRecord::Base.connection.execute(tree_elements_sql)
    tree_elements.each do |tree_element|
      # set sign_manually to false
      update_manager = Arel::UpdateManager.new tree_elements_table.engine
      update_manager.table tree_elements_table
      update_manager.set([
        [tree_elements_table[:sign_manually], false]
      ]).where(tree_elements_table[:id].eq(tree_element['id']))

      # save the change
      ActiveRecord::Base.connection.execute update_manager.to_sql
    end
  end
end
