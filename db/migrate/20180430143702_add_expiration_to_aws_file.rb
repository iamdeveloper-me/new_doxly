class AddExpirationToAwsFile < ActiveRecord::Migration
  def change
    add_column :aws_files, :expiration_datetime, :datetime
    add_column :aws_files, :has_expiration_datetime, :boolean, default: false, null: false
  end
end
