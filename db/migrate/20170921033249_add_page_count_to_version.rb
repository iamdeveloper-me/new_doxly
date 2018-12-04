class AddPageCountToVersion < ActiveRecord::Migration
  def change
    add_column :versions, :page_count, :integer
  end
end
