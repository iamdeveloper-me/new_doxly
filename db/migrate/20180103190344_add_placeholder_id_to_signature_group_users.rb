class AddPlaceholderIdToSignatureGroupUsers < ActiveRecord::Migration
  def change
    add_column :signature_group_users, :placeholder_id, :integer
  end
end
