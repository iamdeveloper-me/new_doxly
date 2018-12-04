class AddIndexToNoteable < ActiveRecord::Migration
  def change
    add_index :notes, [:noteable_id, :noteable_type]
  end
end
