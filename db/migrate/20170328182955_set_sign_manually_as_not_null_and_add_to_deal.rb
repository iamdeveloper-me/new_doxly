class SetSignManuallyAsNotNullAndAddToDeal < ActiveRecord::Migration
  def change
    # update tree_elements table
    change_column_null :tree_elements, :sign_manually, false
    change_column_default :tree_elements, :sign_manually, false

    # update deals table
    add_column :deals, :sign_manually_by_default, :boolean, null: false, default: false
    remove_column :deals, :signature_method, :string
  end
end
