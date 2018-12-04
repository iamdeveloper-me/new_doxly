class RenameShowAliasToShowGroupName < ActiveRecord::Migration
  def change
    rename_column :tree_element_signature_groups, :show_alias, :show_group_name
  end
end
