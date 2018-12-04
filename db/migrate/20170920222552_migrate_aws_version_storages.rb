class MigrateAwsVersionStorages < ActiveRecord::Migration
  def change
    remove_column   :aws_version_storages, :original_key
    remove_column   :aws_version_storages, :converted_key
  end
end
