class AddMetadataColumnsToDifferentTables < ActiveRecord::Migration
  def change
    add_column :organization_users, :title, :string
    add_column :role_links, :label, :string
  end
end
