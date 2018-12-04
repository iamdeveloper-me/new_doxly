class CreateAwsVersionStorage < ActiveRecord::Migration
  def change
    create_table :aws_version_storages do |t|
      t.string      :original_key
      t.string      :converted_key
      t.timestamps  null: false
    end
  end
end
