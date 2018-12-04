class AddMoveToDmsStatusToVersion < ActiveRecord::Migration
  def change
    add_column :versions, :sending_to_dms_status, :string
  end
end
