class AddTitleToSignatureGroup < ActiveRecord::Migration
  def change
    add_column :signature_groups, :title, :string
  end
end
