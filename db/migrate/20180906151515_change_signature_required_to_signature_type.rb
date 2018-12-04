class ChangeSignatureRequiredToSignatureType < ActiveRecord::Migration
  def change
    # create signature_type column
    remove_column :tree_elements, :signature_type, :string
    add_column :tree_elements, :signature_type, :integer, null: false, default: 0
    add_index :tree_elements, :signature_type

    # migrate data
    tree_elements = Arel::Table.new(:tree_elements)
    update_manager = Arel::UpdateManager.new(ActiveRecord::Base)
    update_manager.table(tree_elements).where(tree_elements[:signature_required].eq(true))
    update_manager.set([[tree_elements[:signature_type], 1]])
    ActiveRecord::Base.connection.execute update_manager.to_sql

    # delete signature_required column
    remove_column :tree_elements, :signature_required, :boolean
  end
end
