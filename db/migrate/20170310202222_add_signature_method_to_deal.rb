class AddSignatureMethodToDeal < ActiveRecord::Migration
  def change
    add_column :deals, :signature_method, :string, null: false, default: "Docusign"
  end
end
