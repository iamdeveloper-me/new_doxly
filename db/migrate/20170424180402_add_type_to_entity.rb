class AddTypeToEntity < ActiveRecord::Migration
  def change
    add_column :entities, :type, :string
  end
end
