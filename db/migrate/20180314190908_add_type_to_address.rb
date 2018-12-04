class AddTypeToAddress < ActiveRecord::Migration
  def change
    add_column :addresses, :type, :string, default: 'PrimaryAddress', null: false
  end
end
