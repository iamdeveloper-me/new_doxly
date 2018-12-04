class AddTypeToSignatureGroup < ActiveRecord::Migration
  def change
    add_column :signature_groups, :type, :string
    
    add_index :signature_groups, :type
  end
end
