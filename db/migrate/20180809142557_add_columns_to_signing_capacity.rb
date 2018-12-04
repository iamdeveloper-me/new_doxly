class AddColumnsToSigningCapacity < ActiveRecord::Migration
  def change
    add_column :signing_capacities, :first_name, :string
    add_column :signing_capacities, :last_name, :string
  end
end
