class AddInheritToTreeElementRestrictions < ActiveRecord::Migration
  def change
    add_column :tree_element_restrictions, :inherit, :boolean, default: false
  end
end
