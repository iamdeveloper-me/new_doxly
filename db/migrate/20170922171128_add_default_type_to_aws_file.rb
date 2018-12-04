class AddDefaultTypeToAwsFile < ActiveRecord::Migration
  def change
    change_column :aws_files, :type, :string, default: 'AwsFile'
  end
end
