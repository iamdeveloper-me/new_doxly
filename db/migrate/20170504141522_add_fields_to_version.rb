class AddFieldsToVersion < ActiveRecord::Migration
  def change
    add_column :versions, :file_name, :string
    add_column :versions, :upload_method, :string
    add_column :versions, :position, :integer
    add_column :versions, :status, :string
    rename_column :versions, :is_executed_at, :status_set_at
    rename_column :versions, :organization_user_id, :uploader_id
  end
end