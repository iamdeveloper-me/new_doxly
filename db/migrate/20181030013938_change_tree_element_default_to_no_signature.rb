class ChangeTreeElementDefaultToNoSignature < ActiveRecord::Migration
  def change
    change_column_default :tree_elements, :signature_type, 0
  end
end
