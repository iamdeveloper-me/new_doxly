class AddSigningAuthorityToSignatureGroups < ActiveRecord::Migration
  def change
    add_column :signature_groups, :signing_authority, :string
  end
end
