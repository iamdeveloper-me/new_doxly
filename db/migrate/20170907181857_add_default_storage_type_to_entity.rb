class AddDefaultStorageTypeToEntity < ActiveRecord::Migration
  def change
    add_column :entities, :default_entity_storage_type, :string, default: "aws"
  end
end
