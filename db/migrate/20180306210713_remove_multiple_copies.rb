class RemoveMultipleCopies < ActiveRecord::Migration
  def change
    SignaturePage.select{|x| x.tree_element.number_of_signature_page_copies > 1}.select{|sp| SignaturePage.where(tree_element_signature_group_id: sp.tree_element_signature_group_id, signature_group_user_id: sp.signature_group_user_id).length > 1}.count

    signature_pages_table = Arel::Table.new(:signature_pages)
    signature_pages_sql = signature_pages_table.project(Arel.sql("*")).to_sql
    signature_pages = ActiveRecord::Base.connection.execute(signature_pages_sql)

    tree_element_signature_groups_table = Arel::Table.new(:tree_element_signature_groups)
    tree_elements_table = Arel::Table.new(:tree_elements)

    signature_page_executions_table = Arel::Table.new(:signature_page_executions)

    # don't bother checking ids for pages that we've destroyed.
    ids_to_skip = []

    # iterate over all signature_pages
    signature_pages.each do |signature_page|
      next if ids_to_skip.uniq.include?(signature_page["id"])

      # find the signature_page's tree_element_signature_group
      tree_element_signature_group_id      = signature_page["tree_element_signature_group_id"]
      tree_element_signature_group_sql     = tree_element_signature_groups_table.where(tree_element_signature_groups_table["id"].eq(tree_element_signature_group_id)).project(Arel.sql("*")).to_sql
      tree_element_signature_group         = ActiveRecord::Base.connection.execute(tree_element_signature_group_sql).first

      # find the signature_page's tree_element
      tree_element_id       = tree_element_signature_group['tree_element_id']
      tree_element_sql      = tree_elements_table.where(tree_elements_table["id"].eq(tree_element_id)).project(Arel.sql("*")).to_sql
      tree_element          = ActiveRecord::Base.connection.execute(tree_element_sql).first

      # skip if it's not a multiple copies signature page
      next if tree_element["number_of_signature_page_copies"].to_i < 2

      # get all of the signature_page records that are identical (copies)
      multiple_signature_pages_sql = signature_pages_table.where(signature_pages_table["signature_group_user_id"].eq(signature_page["signature_group_user_id"])).where(signature_pages_table["tree_element_signature_group_id"].eq(signature_page["tree_element_signature_group_id"])).project(Arel.sql("*")).to_sql
      multiple_signature_pages     = ActiveRecord::Base.connection.execute(multiple_signature_pages_sql)

      # make sure there's actually copies that exist, not just the number on the tree_element.
      next if multiple_signature_pages.to_a.length < 2

      # map over all the copies to get the ids to destroy
      ids_to_destroy = multiple_signature_pages.map{ |multiple_page| multiple_page['id']}
      ids_to_destroy.pop #save one of them!

      # delete the remaining ids
      delete_manager = Arel::DeleteManager.new(ActiveRecord::Base)
      delete_manager.from(signature_pages_table).where(signature_pages_table[:id].eq_any(ids_to_destroy))
      ActiveRecord::Base.connection.execute(delete_manager.to_sql)

      # push the destroyed ids into the array to skip.
      ids_to_skip.push(*ids_to_destroy)
    end
  end
end
