class AddReleasedOnVersionToversion < ActiveRecord::Migration
  def change
    add_column :versions, :executed_against_version_id, :integer
  end
end
